export type UserType = {
  userId: number;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  age?: number;
  createdAt: string;
  updatedAt?: string;
};

export type Project = {
  name: string;
  description?: string;
  imageUrl: string;
  organizationId: number;
  ownerId: number;
};

export type Role = "admin" | "moderator" | "user";
export type AuthorizedUser = {
  iat?: number;
  userId: number;
  firstName: string;
  lastName?: string;
  roles: {
    organizationId: number;
    domain: string;
    role: Role;
  }[];
};

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: AuthorizedUser, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  users: {
    dataType: UserType;
    action: "view" | "create" | "update" | "delete";
  };
  projects: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Project;
    action: "view" | "create" | "update" | "delete";
  };
};

const ROLES = {
  admin: {
    users: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    projects: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  moderator: {
    users: {
      view: true,
      create: false,
      update: (authorizedUser, user) => authorizedUser.userId === user.userId,
      delete: (authorizedUser, user) => authorizedUser.userId === user.userId,
    },
    projects: {
      view: true,
      create: true,
      update: true,
      delete: (authorizedUser, project) =>
        project.ownerId === authorizedUser.userId,
    },
  },
  user: {
    users: {
      view: true,
      create: false,
      update: (authorizedUser, user) => authorizedUser.userId === user.userId,
      delete: (authorizedUser, user) => authorizedUser.userId === user.userId,
    },
    projects: {
      view: true,
      create: true,
      update: (authorizedUser, project) =>
        project.ownerId === authorizedUser.userId,
      delete: (authorizedUser, project) =>
        project.ownerId === authorizedUser.userId,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  authorizedUser: AuthorizedUser,
  organizationId: number,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  const orgRoles = authorizedUser.roles
    .filter((r) => r.organizationId === organizationId)
    .map((r) => r.role);
  return orgRoles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(authorizedUser, data);
  });
}
