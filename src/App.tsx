import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Tournaments from "./pages/Tournaments";
import Players from "./pages/Players";
import DataManager from "./pages/DataManager";

import * as ROUTES from "./global/routes";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.TOURNAMENTS} element={<Tournaments />} />
          <Route path={ROUTES.PLAYERS} element={<Players />} />
          <Route path={ROUTES.DATA_MANAGER} element={<DataManager />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
