import { RouteProps, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PrivateRoute = (props: RouteProps) => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }
  return <Route {...props} />;
};

export default PrivateRoute;
