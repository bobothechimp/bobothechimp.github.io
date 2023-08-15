import Home from "./pages/Home";
import About from "./pages/About";
import Tournaments from "./pages/Tournaments";
import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import * as ROUTES from "./global/routes";
import AddRemove from "./pages/AddRemove";

function App() {
  const [message, setMessage] = useState("Welcome!");
  const [showAlert, setShowAlert] = useState(false);
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.TOURNAMENTS} element={<Tournaments />} />
          <Route path={ROUTES.ADDREMOVE} element={<AddRemove />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
