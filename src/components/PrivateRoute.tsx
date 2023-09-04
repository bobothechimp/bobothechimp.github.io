import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import * as ROUTES from "../global/routes";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to={ROUTES.HOME} />;
}
