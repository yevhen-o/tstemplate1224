import { useEffect } from "react";
import { createSelector } from "reselect";
import { useParams } from "react-router";
import { RootState } from "src/store";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector, isOutdated } from "src/hooks";

type Params = {
  organizationId: string;
};

export const selectUsersFromOrganizationById = createSelector(
  [
    (state: RootState) => state.organization.orgById,
    (state: RootState) => state.organization.userById,
    (_: RootState, orgId: string | undefined) => orgId,
  ],
  (orgById, userById, orgId) => {
    if (!orgId) return undefined;

    const org = orgById[orgId];
    if (!org) return undefined;

    const users = (org.getOrgMembers?.data || [])
      .map((userId) => userById[userId])
      .filter(Boolean);

    return {
      users,
      ...org.getOrgMembers,
    };
  }
);

const OrganizationMembers: React.FC = () => {
  const { organizationId } = useParams<Params>();

  const orgMembers = useTypedSelector((state) =>
    selectUsersFromOrganizationById(state, organizationId)
  );

  const { getOrgUsers } = useActions();

  useEffect(() => {
    if (organizationId && (!orgMembers || isOutdated(orgMembers))) {
      getOrgUsers({ organizationId: +organizationId });
    }
  }, [organizationId, getOrgUsers, orgMembers]);

  if (!orgMembers) {
    return <>Loading...</>;
  }

  const { isFetching, isFetched, error, users } = orgMembers;

  return (
    <div className="px-8">
      <h1>Organization</h1>
      {isFetching && <div>Loading...</div>}
      {error && <div>{error.message || `Something went wrong...`}</div>}
      {isFetched && users.map((u) => <div key={u.userId}>{u.firstName}</div>)}
    </div>
  );
};

export default OrganizationMembers;
