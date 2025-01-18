import { useEffect } from "react";
import { createSelector } from "reselect";
import { useParams } from "react-router";
import { RootState } from "src/store";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector, isOutdated, FieldType } from "src/hooks";
import Table from "src/components/Table";
import DropDownCss from "src/components/DropDownCss";
import { UserType } from "src/store/organization/organizationSlice";
import { FILTER_ALL_VALUE } from "src/constants";

import "./OrganizationMembers.scss";
import { formatDate } from "src/helpers/formatDate";
import { useHasOrgPermission } from "src/hooks/useHasOrgPermission";

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

  const RenderActions = (record: UserType) => {
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
            label: "Delete",
            value: "4",
            disabled: !useHasOrgPermission("users", "delete", record),
            onClick: () => console.log("allow delete record", record),
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

  const filterFields: FieldType[] = [
    { fieldType: "input", name: "search", label: "Search" },
    {
      fieldType: "select",
      name: "priority",
      label: "Priority",
      options: [
        { value: FILTER_ALL_VALUE, label: "All" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
    {
      fieldType: "select",
      name: "scope",
      label: "Scope",
      options: [
        { value: FILTER_ALL_VALUE, label: "All" },
        { value: "forWork", label: "For Work" },
        { value: "forFun", label: "For Fun" },
      ],
    },
    {
      fieldType: "select",
      name: "isImportant",
      label: "Is Important",
      options: [
        { value: FILTER_ALL_VALUE, label: "All" },
        { value: "true", label: "Important" },
        { value: "false", label: "Not important" },
      ],
    },
  ];

  const { isFetching, isFetched, error, users } = orgMembers;

  return (
    <div className="px-8">
      <h1>Organization</h1>
      {isFetching && <div>Loading...</div>}
      {error && <div>{error.message || `Something went wrong...`}</div>}
      {isFetched && (
        <Table
          data={users}
          filterFields={filterFields}
          renderFunctions={{
            actions: RenderActions,
            createdAt: renderCreatedAt,
          }}
          headerFields={headerFields}
          name="organization__members"
        />
      )}
    </div>
  );
};

export default OrganizationMembers;
