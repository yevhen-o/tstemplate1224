import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router";

import { store } from "src/store/store";
import "./App.css";
import HomePage from "./pages/HomePage";
import ViewTodo from "./components/Todos/ViewTodo";
import { getReactRouterPath, IDENTIFIERS } from "./helpers/urlsHelper";
import ClientScreenChangeListener from "./components/ClientScreenChangeListener";
import TodosPage from "./pages/TodosPage";

function App() {
  return (
    <Provider store={store}>
      <ClientScreenChangeListener />
      <BrowserRouter>
        <Routes>
          <Route
            path={getReactRouterPath(IDENTIFIERS.HOME)}
            element={<HomePage />}
          />
          <Route
            path={getReactRouterPath(IDENTIFIERS.TODOS)}
            element={<TodosPage />}
          />
          <Route
            path={getReactRouterPath(IDENTIFIERS.TODO_VIEW)}
            element={<ViewTodo />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
