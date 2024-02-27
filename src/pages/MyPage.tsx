import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate, Outlet } from "react-router-dom";

const SellerButtons = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("product-list")}>전체 상품 조회</Button>
      <Button onClick={() => navigate("product-upload")}>상품 등록</Button>
    </div>
  );
};

const BuyerButtons = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("orderhistory")}>구매 내역</Button>
    </div>
  );
};

const MyPage = () => {
  const { user } = useAuth(); // 로그인 상태와 사용자 정보를 가져옵니다.
  const navigate = useNavigate(); // 홈 홈으로 이동하기 위한 함수를 가져옵니다.

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // 로그아웃 후 홈 페이지로 이동
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h1>My Page</h1>
      <Button onClick={handleLogout}>Logout</Button>
      {user.isSeller ? (
        // 판매자에게만 보이는 버튼
        <SellerButtons />
      ) : (
        // 구매자에게만 보이는 버튼
        <BuyerButtons />
      )}
      <Outlet />
    </div>
  );
};

export default MyPage;
