import React from "react";
import { useAuth } from "@/context/AuthContext";

const MyPage = () => {
  const { accountType } = useAuth();

  return (
    <div>
      <h1>My Page</h1>
      {accountType === "seller" && (
        <button>판매 관련 기능</button> // 판매자에게만 보이는 버튼
      )}
      {accountType === "buyer" && (
        <button>구매 관련 기능</button> // 구매자에게만 보이는 버튼
      )}
    </div>
  );
};

export default MyPage;
