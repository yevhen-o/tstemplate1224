import { useEffect } from "react";
import { createSelector } from "reselect";
import { useParams } from "react-router";
import { RootState } from "src/store";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector, isOutdated } from "src/hooks";

type Params = {
  organizationId: string;
};

const selectOrganizationById = createSelector(
  [
    (state: RootState) => state.organization.orgById,
    (_: RootState, orgId: string | undefined) => orgId,
  ],
  (itemsById, orgId) => {
    if (!orgId) return undefined;
    const org = itemsById[orgId];
    return org ? { ...org.getOrg, ...org.generalInfo } : undefined;
  }
);

const OrganizationOverView: React.FC = () => {
  const { organizationId } = useParams<Params>();

  const organization = useTypedSelector((state) =>
    selectOrganizationById(state, organizationId)
  );

  const { getOrgInfo } = useActions();

  useEffect(() => {
    if (organizationId && (!organization || isOutdated(organization))) {
      getOrgInfo({ organizationId: +organizationId });
    }
  }, [organizationId, getOrgInfo, organization]);

  if (!organization) {
    return <>Loading...</>;
  }

  const { isFetching, isFetched, error } = organization;

  return (
    <div className="px-8">
      <h1>Organization</h1>
      {isFetching && <div>Loading...</div>}
      {error && <div>{error.message || `Something went wrong...`}</div>}
      {isFetched && organization && (
        <code>{JSON.stringify(organization, null, 4)}</code>
      )}
    </div>
  );
};

export default OrganizationOverView;
