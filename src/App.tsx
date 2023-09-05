import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Tournaments from "./pages/Tournaments";
import Players from "./pages/Players";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataManager from "./pages/DataManager";
import ChangeTweets from "./pages/ChangeTweets";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import * as ROUTES from "./global/routes";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <AuthProvider>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.TOURNAMENTS} element={<Tournaments />} />
            <Route path={ROUTES.PLAYERS} element={<Players />} />
            <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_DATA_MANAGER}
              element={
                <PrivateRoute>
                  <DataManager />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_CHANGE_TWEETS}
              element={
                <PrivateRoute>
                  <ChangeTweets />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
