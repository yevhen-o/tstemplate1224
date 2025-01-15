import { useEffect } from "react";
import { createSelector } from "reselect";
import { useParams } from "react-router";
import { RootState } from "src/store";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector, isOutdated } from "src/hooks";
import Table from "src/components/Table";
import DropDownCss from "src/components/DropDownCss";
import { UserType } from "src/store/organization/organizationSlice";

import "./OrganizationMembers.scss";
import { formatDate } from "src/helpers/formatDate";

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

  const headerFields = [
    { title: "ID", field: "userId", isAlwaysVisible: true },
    {
      title: "First name",
      field: "firstName",
      isSortable: true,
    },
    {
      title: "Last name",
      field: "lastName",
      isSortable: true,
    },
    {
      title: "Email",
      field: "email",
      isSortable: true,
    },
    {
      title: "Created at",
      field: "createdAt",
      isSortable: true,
    },
    {
      title: "",
      field: "actions",
      isAlwaysVisible: true,
    },
  ];

  const renderActions = (record: UserType) => {
    return (
      <DropDownCss
        className="org-members__menu"
        options={[
          {
            label: "Do something",
            value: "1",
            onClick: () => console.log("do smth with", record),
          },
          {
            label: "Do something else",
            value: "2",
            onClick: () => console.log("do smth else", record),
          },
          {
            label: "Do something instead",
            value: "3",
            onClick: () => console.log("do smth instead", record),
          },
          {
            label: "Do something important",
            value: "4",
            onClick: () => console.log("do smth important", record),
          },
        ]}
      >
        ···
      </DropDownCss>
    );
  };

  const renderCreatedAt = (record: UserType) => (
    <>{formatDate(record.createdAt)}</>
  );

  if (!orgMembers) {
    return <>Loading...</>;
  }

  const { isFetching, isFetched, error, users } = orgMembers;

  return (
    <div className="px-8">
      <h1>Organization</h1>
      {isFetching && <div>Loading...</div>}
      {error && <div>{error.message || `Something went wrong...`}</div>}
      {isFetched && (
        <Table
          data={users}
          renderFunctions={{
            actions: renderActions,
            createdAt: renderCreatedAt,
          }}
          sortBy="lastName"
          headerFields={headerFields}
          name="organization__members"
        />
      )}
    </div>
  );
};

export default OrganizationMembers;
