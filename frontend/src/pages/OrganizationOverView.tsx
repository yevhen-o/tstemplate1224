import { useEffect, useRef } from "react";
import { createSelector } from "reselect";
import { useNavigate, useParams } from "react-router";
import { RootState } from "src/store";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector, isOutdated } from "src/hooks";
import Buttons from "src/components/Buttons/Buttons";
import { getUrl, IDENTIFIERS } from "src/services/urlsHelper";

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

  const organizationRef = useRef(organization);

  const { getOrgInfo, deleteOrganization } = useActions();

  useEffect(() => {
    if (
      organizationId &&
      (!organizationRef.current || isOutdated(organizationRef.current))
    ) {
      getOrgInfo({ organizationId: +organizationId });
    }
  }, [organizationId, getOrgInfo, organizationRef]);

  const navigate = useNavigate();

  const handleDeleteOrganization = async () => {
    const res = (await deleteOrganization({
      organizationId: +organizationId!,
    })) as unknown as { error?: string };
    if (!res.error) navigate(getUrl(IDENTIFIERS.ORGANIZATION_LIST));
  };

  if (!organization) {
    return <>Loading...</>;
  }

  const { isFetching, isFetched, error } = organization;

  return (
    <div className="px-8">
      <h1>Organization</h1>
      {isFetching && <div>Loading...</div>}
      {error && <div>{error.message || `Something went wrong...`}</div>}
      <Buttons isBordered onClick={handleDeleteOrganization}>
        Delete organization
      </Buttons>
      {isFetched && organization && (
        <code>{JSON.stringify(organization, null, 4)}</code>
      )}
    </div>
  );
};

export default OrganizationOverView;
