import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router";

import { store } from "src/store/store";
import "./App.css";
import HomePage from "./pages/HomePage";
import Todos from "./components/Todos";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
