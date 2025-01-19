import { RootState } from "src/store";
import classNames from "classnames";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { createSelector } from "reselect";

import { useActions, useTypedSelector } from "src/hooks";
import { Close } from "src/components/Icons";
import { getUrl, IDENTIFIERS, Link } from "src/services/urlsHelper";
import { useEffect } from "react";
import Button from "src/components/Buttons";

type ListItemType = {
  to: string;
  children: React.ReactNode;
  projectToRemove?: number;
};
const ListItem: React.FC<ListItemType> = ({
  to,
  children,
  projectToRemove,
}) => {
  const location = useLocation();
  const { removeLatestProject } = useActions();
  return (
    <li
      className={classNames({
        "relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white":
          location.pathname !== to,
        "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium":
          location.pathname === to,
      })}
    >
      <Link to={to}>{children}</Link>
      {projectToRemove && location.pathname !== to && (
        <Button onClick={() => removeLatestProject(projectToRemove)}>
          <Close size={20} />
        </Button>
      )}
    </li>
  );
};

type Params = {
  projectId: string;
};

const selectProjectById = createSelector(
  [
    (state: RootState) => state.organization.projectById,
    (_: RootState, projectId: string | undefined) => projectId,
  ],
  (itemsById, projectId) => {
    if (!projectId) return undefined;
    const project = itemsById[projectId];
    return project ? { ...project } : undefined;
  }
);

const selectProjectsById = createSelector(
  [
    (state: RootState) => state.organization.projectById,
    (state: RootState) => state.latestProjects.latestProjects,
  ],
  (itemsById, projectIds) => {
    if (!projectIds) return undefined;
    const projects = projectIds.map((projectId) => itemsById[projectId]);
    return projects ? projects : undefined;
  }
);

const ProjectLayout: React.FC = () => {
  const { projectId } = useParams<Params>();

  const project = useTypedSelector((state) =>
    selectProjectById(state, projectId)
  );

  const latestProjects = useTypedSelector(selectProjectsById);

  const { addLatestProject } = useActions();

  useEffect(() => {
    if (projectId) addLatestProject(+projectId);
  }, [projectId, addLatestProject]);

  return (
    <>
      {project && (
        <div>
          <header>
            <nav className="bg-gray-100">
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <ul className="relative flex h-16 items-center justify-start gap-2">
                  <ListItem
                    to={getUrl(IDENTIFIERS.ORGANIZATION_PROJECTS, {
                      organizationId: project.organizationId!,
                    })}
                  >
                    Projects List
                  </ListItem>
                  {latestProjects?.map((project) => {
                    return (
                      <ListItem
                        key={project.projectId}
                        to={getUrl(IDENTIFIERS.PROJECT_VIEW, {
                          projectId: project.projectId,
                        })}
                        projectToRemove={project.projectId}
                      >
                        {project.name}
                      </ListItem>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </header>
          <div>
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectLayout;
