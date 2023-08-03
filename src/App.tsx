import Home from "./pages/Home";
import About from "./pages/About";
import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import * as ROUTES from "./global/routes";

function App() {
  const [message, setMessage] = useState("Welcome!");
  const [showAlert, setShowAlert] = useState(false);
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
