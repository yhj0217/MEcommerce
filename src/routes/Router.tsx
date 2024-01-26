import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Splash from "@/pages/splash";
import Login from "@/pages/Login";
import MyPage from "@/pages/MyPage";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function Router() {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {loggedIn ? (
        <>
          <PrivateRoute path="/mypage" element={<MyPage />} />
          // 로그인하면 볼 수 있는 페이지 추가
        </>
      ) : (
        <>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
}
