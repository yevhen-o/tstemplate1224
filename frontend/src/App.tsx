import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import Router from "./Router";
import { store } from "src/store/store";
import ClientScreenChangeListener from "./components/ClientScreenChangeListener";
import "./App.scss";
import ToastProvider from "./components/ToastProvider";

function App() {
  return (
    <Provider store={store}>
      <ClientScreenChangeListener />
      <ToastProvider />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
