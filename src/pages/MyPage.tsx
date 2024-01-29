import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const authContext = useAuth(); // 로그인 상태와 사용자 정보를 가져옵니다.
  const navigate = useNavigate(); // 홈 화면으로 이동하기 위한 함수를 가져옵니다.

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/home"); // 로그아웃 후 홈 화면으로 이동
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <div>
      <h1>My Page</h1>
      {authContext?.isLogin && authContext.user?.isSeller ? (
        // 판매자에게만 보이는 버튼
        <Button>Seller Button</Button>
      ) : (
        // 구매자에게만 보이는 버튼
        <Button>Buyer Button</Button>
      )}
      {authContext?.isLogin && (
        // 로그아웃 버튼
        <Button onClick={handleLogout}>Logout</Button>
      )}
    </div>
  );
};

export default MyPage;
