import { CartContext } from "@/context/CartContext";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";

// type CartProduct = {
//   cartId: string;
//   productId: string;
//   sellerId: string;
//   productName: string;
//   productImage: string[];
//   productPrice: number;
//   productQuantity: number;
// };

const Order = () => {
  const { uid } = useParams<{ uid: string }>();
  const { cartItems, setCartItems } = useContext(CartContext);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
  });

  // 구매 여부 상태 설정
  const [purchaseStatus, setPurchaseStatus] = useState(
    new Array(cartItems.length).fill(false)
  );

  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = () => {
    const { name, phone, email, address, postalCode } = customerInfo;
    if (!name || !phone || !email || !address || !postalCode) {
      alert("모든 정보를 입력하세요.");
      return;
    }

    // 주문 처리 로직...

    const handleCheckboxChange = (index: number) => {
      const newPurchaseStatus = [...purchaseStatus];
      newPurchaseStatus[index] = !newPurchaseStatus[index];
      setPurchaseStatus(newPurchaseStatus);
    };
  };

  return (
    <div className="container mx-auto">
      <div className="border-2 divide-y-2">
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="col-span-1">주문 상품 정보</div>
          <div className="col-span-1">수량</div>
          <div className="col-span-1">가격</div>
          <div className="col-span-1">구매 여부</div>
        </div>

        {cartItems?.map((item, index: number) => (
          <div className="grid grid-cols-4 gap-4 p-4" key={index}>
            <div className="col-span-1">
              <img
                src={cartItems.productImage[0]}
                alt="상품 첫 이미지"
                className="object-cover w-16 h-16 mr-2"
              />
              {item.productName}
            </div>
            <div className="col-span-1">{item.productQuantity}</div>
            <div className="col-span-1">
              {item.productQuantity * item.productPrice}
            </div>
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={purchaseStatus[index]}
                onChange={() => handleCheckboxChange(index)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl">주문자 정보</h2>
        <form>
          <input
            type="text"
            name="name"
            placeholder="이름"
            onChange={handleChange}
            className="w-full p-2 mb-2 border"
          />
          <input
            type="text"
            name="phone"
            placeholder="전화번호"
            onChange={handleChange}
            className="w-full p-2 mb-2 border"
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            onChange={handleChange}
            className="w-full p-2 mb-2 border"
          />
          <input
            type="text"
            name="address"
            placeholder="주소"
            onChange={handleChange}
            className="w-full p-2 mb-2 border"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="우편번호"
            onChange={handleChange}
            className="w-full p-2 mb-2 border"
          />
        </form>
        <button
          onClick={handleOrder}
          className="w-full p-2 mt-4 text-white bg-blue-500"
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default Order;
