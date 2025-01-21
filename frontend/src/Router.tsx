import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router";
import { Suspense, lazy } from "react";
import "./App.scss";

import RootLayout from "./Layouts/RootLayout";
import ProjectLayout from "./Layouts/ProjectLayout";
import OrganizationLayout from "./Layouts/OrganizationLayout";
import { storageGetKey, storageGetLatest } from "src/services/localStorage";
import {
  getUrl,
  getReactRouterPath,
  IDENTIFIERS,
} from "src/services/urlsHelper";

const HomePage = lazy(() => import("./pages/HomePage"));
const TodosPage = lazy(() => import("./pages/TodosPage"));
const DropDownsPage = lazy(() => import("./pages/DropDownsPage"));
const ViewTodo = lazy(() => import("./components/Todos/ViewTodo"));
const OrganizationList = lazy(() => import("./pages/OrganizationsList"));
const OrganizationOverView = lazy(() => import("./pages/OrganizationOverView"));
const OrganizationMembers = lazy(
  () => import("./pages/OrganizationMembers/OrganizationMembers")
);
const OrganizationProjects = lazy(() => import("./pages/OrganizationProjects"));
const UserSettings = lazy(() => import("./pages/UserSetting"));
const ProjectView = lazy(() => import("./pages/ProjectView"));

type RouterParamsProps =
  | { children: React.ReactElement; element?: never }
  | { element: React.ReactElement; children?: never };

const RouterParams: React.FC<RouterParamsProps> = ({ children, element }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const storedValues = storageGetLatest(storageGetKey(pathname), {});

  return (
    <Suspense fallback={<>Loading...</>}>
      {!searchParams.toString() && Object.keys(storedValues).length ? (
        <Navigate to={getUrl(pathname as IDENTIFIERS, storedValues)} />
      ) : (
        children || element
      )}
    </Suspense>
  );
};

function Router() {
  return (
    <Routes>
      <Route
        path={getReactRouterPath(IDENTIFIERS.HOME)}
        element={<RootLayout />}
      >
        <Route
          path={getReactRouterPath(IDENTIFIERS.HOME)}
          element={<RouterParams element={<HomePage />} />}
        />
        <Route
          path={getReactRouterPath(IDENTIFIERS.TODOS)}
          element={<RouterParams element={<TodosPage />} />}
        />
        <Route
          path={getReactRouterPath(IDENTIFIERS.TODO_VIEW)}
          element={<RouterParams element={<ViewTodo />} />}
        />
        <Route
          path={getReactRouterPath(IDENTIFIERS.DROP_DOWNS)}
          element={<RouterParams element={<DropDownsPage />} />}
        />
        <Route
          path={getReactRouterPath(IDENTIFIERS.ORGANIZATION_LIST)}
          element={<RouterParams element={<OrganizationList />} />}
        />
        <Route
          path={getReactRouterPath(IDENTIFIERS.USER_SETTINGS)}
          element={<RouterParams element={<UserSettings />} />}
        />
        <Route
          path={getReactRouterPath(IDENTIFIERS.ORGANIZATION_VIEW)}
          element={<OrganizationLayout />}
        >
          <Route
            path={getReactRouterPath(IDENTIFIERS.ORGANIZATION_VIEW)}
            element={<RouterParams element={<OrganizationOverView />} />}
          />
          <Route
            path={getReactRouterPath(IDENTIFIERS.ORGANIZATION_MEMBERS)}
            element={<RouterParams element={<OrganizationMembers />} />}
          />
          <Route
            path={getReactRouterPath(IDENTIFIERS.ORGANIZATION_PROJECTS)}
            element={<RouterParams element={<OrganizationProjects />} />}
          />
        </Route>
        <Route
          path={getReactRouterPath(IDENTIFIERS.PROJECT_VIEW)}
          element={<ProjectLayout />}
        >
          <Route
            path={getReactRouterPath(IDENTIFIERS.PROJECT_VIEW)}
            element={<RouterParams element={<ProjectView />} />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
