import { useParams } from "react-router";

import { useTypedSelector } from "./useTypedSelector";
import { hasPermission, Permissions } from "src/services/auth/abac";
import { authorizedUserSelector } from "src/store/user/userSlice";

export const useHasOrgPermission = <Resource extends keyof Permissions>(
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
): boolean => {
  const authorizedUser = useTypedSelector(authorizedUserSelector);
  const { organizationId } = useParams<{ organizationId: string }>();
  if (!authorizedUser || !organizationId) return false;
  return hasPermission(authorizedUser, +organizationId, resource, action, data);
};
