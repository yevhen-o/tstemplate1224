import { useEffect, useState } from "react";
import { createSelector } from "reselect";

import { OrgInterface } from "src/Types";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import { authorizedUserSelector } from "src/store/user/userSlice";
import { getUrl, IDENTIFIERS, Link } from "src/services/urlsHelper";
import Buttons from "src/components/Buttons/Buttons";
import AddOrganizationModal from "./AddOrganizationModal";

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

  const authorizedUser = useTypedSelector(authorizedUserSelector);

  const { getOrgList } = useActions();

  useEffect(() => {
    if (authorizedUser) {
      const controller = new AbortController();
      const signal: AbortSignal = controller.signal;
      getOrgList({ userId: authorizedUser?.userId, signal });
      return () => {
        controller.abort();
      };
    }
  }, [getOrgList, authorizedUser]);

  const [isCreateModalShown, setIsCreateModalShown] = useState(false);

  return (
    <>
      <div className="px-8">
        <h1>Organizations</h1>
        {isFetching && <div>Loading...</div>}
        {error && <div>{error || `Something went wrong...`}</div>}
        <Buttons isBordered onClick={() => setIsCreateModalShown(true)}>
          Create new organization
        </Buttons>
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
      {isCreateModalShown && (
        <AddOrganizationModal onClose={() => setIsCreateModalShown(false)} />
      )}
    </>
  );
};

export default OrganizationList;
