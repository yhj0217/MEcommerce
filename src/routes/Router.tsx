import { useRoutes, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Splash from "@/pages/splash";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import MyPage from "@/pages/MyPage";
import ProductList from "@/pages/ProductList";
import ProductUpload from "@/pages/ProductUpload";
import ProductManage from "@/pages/ProductManage";
import Categories from "@/pages/Categories";
import ProductInfo from "@/pages/ProductInfo";
import Order from "@/pages/Order";

import { useAuth } from "@/context/AuthContext";

export default function Router() {
  const { user, loading, isSeller } = useAuth();

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
    {
      path: "/categories/:category",
      element: <Categories />,
    },
    {
      path: "/products/:id",
      element: <ProductInfo />,
    },
    // 판매자 전용
    {
      path: "/mypage/product-list",
      element: loading ? null : user && isSeller ? (
        <ProductList />
      ) : (
        <Navigate to="/mypage" />
      ),
    },
    {
      path: "/mypage/product-upload",
      element: loading ? null : user && isSeller ? (
        <ProductUpload />
      ) : (
        <Navigate to="/mypage" />
      ),
    },
    {
      path: "/mypage/product-manage/:id",
      element: loading ? null : user && isSeller ? (
        <ProductManage />
      ) : (
        <Navigate to="/mypage" />
      ),
    },
    // 구매자 전용
    {
      path: "/order/:uid",
      element: loading ? null : user && !isSeller ? (
        <Order />
      ) : (
        <Navigate to="/" />
      ),
    },
  ]);

  return routing;
}
