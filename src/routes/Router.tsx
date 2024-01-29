import { useRoutes, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Splash from "@/pages/splash";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import MyPage from "@/pages/MyPage";

import { useAuth } from "@/context/AuthContext";

export default function Router() {
  const { user, loading } = useAuth();

  const routing = useRoutes([
    {
      path: "/",
      element: <Splash />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/signup",
      element: loading ? null : !user ? <SignUp /> : <Navigate to="/home" />,
    },
    {
      path: "/login",
      element: loading ? null : !user ? <Login /> : <Navigate to="/home" />,
    },
    {
      path: "/mypage",
      element: loading ? null : user ? <MyPage /> : <Navigate to="/login" />,
    },
  ]);

  return routing;
}
