import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMyPage = () => {
    navigate("/mypage");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div>
      {user ? (
        <>
          <h1>안녕하세요, {user.nickname}님</h1>
          <Button onClick={handleMyPage}>My Page</Button>
        </>
      ) : (
        <>
          <h1>로그인이 필요합니다.</h1>
          <Button onClick={handleLogin}>Login</Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
        </>
      )}
    </div>
  );
};

export default Home;
