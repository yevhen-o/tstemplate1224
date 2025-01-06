import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import Router from "./Router";
import { store } from "src/store/store";
import ClientScreenChangeListener from "./components/ClientScreenChangeListener";
import "./App.scss";

function App() {
  return (
    <Provider store={store}>
      <ClientScreenChangeListener />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
