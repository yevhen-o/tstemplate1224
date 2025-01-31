import { useParams } from "react-router";

import { useTypedSelector } from "./useTypedSelector";
import { hasPermission, Permissions } from "src/services/auth/abac";
import { authorizedUserSelector } from "src/store/user/userSlice";

export const useHasOrgPermission = <Resource extends keyof Permissions>() => {
  const authorizedUser = useTypedSelector(authorizedUserSelector);
  const { organizationId } = useParams<{ organizationId: string }>();
  const authorizedUserHasPermission = (
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
  ) => {
    if (!authorizedUser || !organizationId) return false;

    return hasPermission(
      authorizedUser,
      +organizationId,
      resource,
      action,
      data
    );
  };
  return { authorizedUserHasPermission };
};
