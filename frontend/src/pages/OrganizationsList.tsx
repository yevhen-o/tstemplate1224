import { useEffect } from "react";
import { createSelector } from "reselect";

import { useActions } from "src/hooks/useActions";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import { getUrl, IDENTIFIERS, Link } from "src/services/urlsHelper";
import { OrgInterface } from "src/Types";

const OrganizationList: React.FC = () => {
  const { isFetching, isFetched, error, organizations } = useTypedSelector(
    createSelector(
      [
        (state) => state.organization.orgList,
        (state) => state.organization.orgById,
      ],
      (list, itemsById) => ({
        isFetched: list.isFetched,
        isFetching: list.isFetching,
        error: list.error?.message,
        organizations: list.data
          .map(
            (organizationId: number) => itemsById[organizationId].generalInfo
          )
          .filter(Boolean),
      })
    )
  );

  const { getOrgList } = useActions();

  useEffect(() => {
    const controller = new AbortController();
    const signal: AbortSignal = controller.signal;
    // getOrgList({ signal });
    getOrgList({ signal });
    return () => {
      controller.abort();
    };
  }, [getOrgList]);

  return (
    <div className="px-8">
      <h1>Organizations</h1>
      {isFetching && <div>Loading...</div>}
      {error && <div>{error || `Something went wrong...`}</div>}
      {isFetched &&
        organizations &&
        organizations.map((org: OrgInterface) => (
          <Link
            className="block"
            to={getUrl(IDENTIFIERS.ORGANIZATION_VIEW, {
              organizationId: org.organizationId,
            })}
            key={org.domain}
          >
            {org.domain}
          </Link>
        ))}
    </div>
  );
};

export default OrganizationList;
