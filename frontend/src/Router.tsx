import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router";

import "./App.scss";

import HomePage from "./pages/HomePage";
import TodosPage from "./pages/TodosPage";
import DropDownsPage from "./pages/DropDownsPage";
import ViewTodo from "./components/Todos/ViewTodo";
import { storageGetKey, storageGetLatest } from "src/services/localStorage";
import {
  getUrl,
  getReactRouterPath,
  IDENTIFIERS,
} from "src/services/urlsHelper";

type RouterParamsProps =
  | { children: React.ReactElement; element?: never }
  | { element: React.ReactElement; children?: never };

const RouterParams: React.FC<RouterParamsProps> = ({ children, element }) => {
  const { pathname } = useLocation();
  let [searchParams] = useSearchParams();
  const storedValues = storageGetLatest(storageGetKey(pathname), {});

  return (
    <>
      {!searchParams.toString() && Object.keys(storedValues).length ? (
        <Navigate to={getUrl(pathname as IDENTIFIERS, storedValues)} />
      ) : (
        children || element
      )}
    </>
  );
};

function Router() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default Router;
