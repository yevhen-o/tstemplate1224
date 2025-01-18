import { hasPermission, UserType, Project, AuthorizedUser } from "./abac";

// Sample Data
const authorizedUser: AuthorizedUser = {
  userId: 1,
  firstName: "John",
  lastName: "Doe",
  roles: [
    { organizationId: 100, domain: "main", role: "admin" },
    { organizationId: 101, domain: "secondary", role: "moderator" },
  ],
};

const authorizedUser2: AuthorizedUser = {
  userId: 1,
  firstName: "John",
  lastName: "Doe",
  roles: [
    { organizationId: 100, domain: "main", role: "user" },
    { organizationId: 101, domain: "secondary", role: "moderator" },
  ],
};

const otherUser: UserType = {
  userId: 2,
  firstName: "Jane",
  email: "jane.doe@example.com",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const ownProject: Project = {
  name: "My Project",
  description: "Project owned by John",
  imageUrl: "project.png",
  organizationId: 100,
  ownerId: 1,
};

const otherProject: Project = {
  name: "Other Project",
  description: "Project owned by Jane",
  imageUrl: "other_project.png",
  organizationId: 101,
  ownerId: 2,
};

// Test Cases
describe("ABAC: hasPermission", () => {
  it("allows admin to view users in their organization", () => {
    const result = hasPermission(authorizedUser, 100, "users", "view");
    expect(result).toBe(true);
  });

  it("allows admin to delete any user in their organization", () => {
    const result = hasPermission(
      authorizedUser,
      100,
      "users",
      "delete",
      otherUser
    );
    expect(result).toBe(true);
  });

  it("allows moderator to view users in their organization", () => {
    const result = hasPermission(authorizedUser, 101, "users", "view");
    expect(result).toBe(true);
  });

  it("denies moderator from deleting another user", () => {
    const result = hasPermission(
      authorizedUser,
      101,
      "users",
      "delete",
      otherUser
    );
    expect(result).toBe(false);
  });

  it("allows moderator to delete their own user account", () => {
    const result = hasPermission(authorizedUser, 101, "users", "delete", {
      ...otherUser,
      userId: 1,
    });
    expect(result).toBe(true);
  });

  it("allows user to view their own project", () => {
    const result = hasPermission(
      authorizedUser,
      100,
      "projects",
      "view",
      ownProject
    );
    expect(result).toBe(true);
  });

  it("denies user to update another user's project", () => {
    const result = hasPermission(
      authorizedUser2,
      100,
      "projects",
      "update",
      otherProject
    );
    expect(result).toBe(false);
  });

  it("allows user to update their own project", () => {
    const result = hasPermission(
      authorizedUser,
      100,
      "projects",
      "update",
      ownProject
    );
    expect(result).toBe(true);
  });

  it("allows admin to create projects", () => {
    const result = hasPermission(authorizedUser, 100, "projects", "create");
    expect(result).toBe(true);
  });

  it("denies user to delete projects they don't own", () => {
    const result = hasPermission(
      authorizedUser,
      101,
      "projects",
      "delete",
      otherProject
    );
    expect(result).toBe(false);
  });

  it("allows user to delete their own project", () => {
    const result = hasPermission(
      authorizedUser,
      100,
      "projects",
      "delete",
      ownProject
    );
    expect(result).toBe(true);
  });

  it("denies action if no roles match the organization", () => {
    const result = hasPermission(authorizedUser, 999, "users", "view");
    expect(result).toBe(false);
  });

  it("denies action if no permissions defined for the role", () => {
    const customRoleUser: AuthorizedUser = {
      userId: 3,
      firstName: "Alice",
      roles: [{ organizationId: 100, domain: "custom", role: "user" }],
    };
    const result = hasPermission(
      customRoleUser,
      100,
      "users",
      "delete",
      otherUser
    );
    expect(result).toBe(false);
  });
});
