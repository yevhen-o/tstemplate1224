import { useEffect, useRef } from "react";
import { createSelector } from "reselect";
import { useParams } from "react-router";
import { RootState } from "src/store";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector, isOutdated } from "src/hooks";

type Params = {
  organizationId: string;
};

const selectProjectsFromOrganizationById = createSelector(
  [
    (state: RootState) => state.organization.orgById,
    (state: RootState) => state.organization.projectById,
    (_: RootState, orgId: string | undefined) => orgId,
  ],
  (orgById, projectsById, orgId) => {
    if (!orgId) return undefined;

    const org = orgById[orgId];
    if (!org) return undefined;

    const projects = (org.getOrgProjects?.data || [])
      .map((projectId) => projectsById[projectId])
      .filter(Boolean);

    return {
      projects,
      ...org.getOrgProjects,
    };
  }
);

export const OrganizationProjects: React.FC = () => {
  const { organizationId } = useParams<Params>();

  const orgProjects = useTypedSelector((state) =>
    selectProjectsFromOrganizationById(state, organizationId)
  );

  const orgProjectsRef = useRef(orgProjects);

  useEffect(() => {
    orgProjectsRef.current = orgProjects; // Update the ref whenever orgProjects changes
  }, [orgProjects]);

  const { getOrgProjects } = useActions();

  useEffect(() => {
    if (
      organizationId &&
      (!orgProjectsRef.current || isOutdated(orgProjectsRef.current))
    ) {
      getOrgProjects({ organizationId: +organizationId });
    }
  }, [organizationId, getOrgProjects]);

  if (!orgProjects) {
    return <>Loading...</>;
  }

  const { isFetching, isFetched, error, projects } = orgProjects;

  return (
    <div className="px-8">
      <h1>Organization</h1>
      {isFetching && <div>Loading...</div>}
      {error && <div>{error.message || `Something went wrong...`}</div>}
      {isFetched && projects.map((p) => <div key={p.projectId}>{p.name}</div>)}
    </div>
  );
};

export default OrganizationProjects;
