import Home from "./pages/Home";
import { useState } from "react";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function App() {
  const [message, setMessage] = useState("Welcome!");
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      <Home />
    </>
  );
}

export default App;
