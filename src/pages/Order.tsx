import NavBar from "@/components/NavBar/NavBar";
import {
  RequestPayParams,
  RequestPayResponse,
} from "@/components/types/Iamport";
import { CartContext } from "@/context/CartContext";
import { db } from "@/firebase";
import { OrderStatus } from "@/interface/Order";
import { Timestamp, addDoc, collection } from "@firebase/firestore";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
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
  const { cartItems } = useContext(CartContext);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
  });

  // 구매 여부 상태 설정
  const [purchaseStatus, setPurchaseStatus] = useState(
    new Array(cartItems?.length || 0).fill(false)
  );
  useEffect(() => {
    setPurchaseStatus(new Array(cartItems?.length || 0).fill(false));
  }, [cartItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (index: number) => {
    const newPurchaseStatus = [...purchaseStatus];
    newPurchaseStatus[index] = !newPurchaseStatus[index];
    setPurchaseStatus(newPurchaseStatus);
  };

  const handleOrder = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault;
    const { name, phone, email, address, postalCode } = customerInfo;
    if (!name || !phone || !email || !address || !postalCode) {
      alert("모든 정보를 입력하세요.");
      return;
    }
    if (cartItems) {
      if (!window.IMP) return;
      // 1. 가맹점 식별하기
      const { IMP } = window;
      IMP.init(import.meta.env.VITE_APP_IMP_CODE);

      const checkedItems = cartItems.filter(
        (_, index) => purchaseStatus[index]
      );

      // 체크한 상품의 재고를 감소시킵니다.
      await Promise.all(
        checkedItems.map((item) =>
          updateProductQuantity(item.productId, item.productQuantity)
        )
      );

      const totalPrice = checkedItems.reduce(
        (total, item) => total + item.productPrice * item.productQuantity,
        0
      );
      const orderName = `${checkedItems[0].productName} 등 총 ${checkedItems.length}개의 상품`;

      // 2. 결제 데이터 정의하기
      const data: RequestPayParams = {
        pg: "nice_v2", // PG사
        pay_method: "card", // 결제수단
        merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
        amount: totalPrice, // 결제금액
        name: orderName, // 주문명
        buyer_name: customerInfo.name, // 구매자 이름
        buyer_tel: customerInfo.phone, // 구매자 전화번호
        buyer_email: customerInfo.email, // 구매자 이메일
        buyer_addr: customerInfo.address, // 구매자 주소
        buyer_postcode: customerInfo.postalCode, // 구매자 우편번호
      };

      // 3. 콜백 함수 정의하기
      const callback = async (response: RequestPayResponse) => {
        try {
          const { error_code, error_msg } = response;
          if (!error_code) {
            alert("결제 완료되었습니다.");
            // Order db에 추가
            await Promise.all(
              checkedItems.map((item) => {
                const newOrder = {
                  sellerId: item.sellerId,
                  buyerId: uid,
                  productId: item.productId,
                  productImage: item.productImage,
                  productQuantity: item.productQuantity,
                  productPrice: item.productPrice,
                  Status: OrderStatus.OrderConfirm,
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
                };
                return addDoc(collection(db, "orders"), newOrder);
              })
            );

            // 구매 상품 장바구니 삭제
            await Promise.all(
              checkedItems.map((item) => {
                const docRef = doc(collection(db, "carts"), item.id);
                deleteDoc(docRef);
              })
            );
          } else {
            console.log(error_msg);
            alert("결제 실패");
            await Promise.all(
              checkedItems.map((item) =>
                updateProductQuantity(item.productId, -item.productQuantity)
              )
            );
          }
        } catch (error) {
          console.error(error);
          alert("결제 실패");
          await Promise.all(
            checkedItems.map((item) =>
              updateProductQuantity(item.productId, -item.productQuantity)
            )
          );
        }
      };
      // 4. 결제 창 호출하기
      IMP.request_pay(data, callback);
    }
  };

  // 재고 수정
  const updateProductQuantity = async (productId: string, amount: number) => {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const productData = productSnap.data();
      if (productData) {
        const newQuantity = productData.productQuantity - amount;
        await updateDoc(productRef, { productQuantity: newQuantity });
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        <div className="border-2 divide-y-2">
          <div className="grid grid-cols-4 gap-4 p-4 text-xl font-bold">
            <div className="col-span-1">주문 상품 정보</div>
            <div className="col-span-1">수량</div>
            <div className="col-span-1">가격</div>
            <div className="col-span-1">구매 여부</div>
          </div>

          {cartItems?.map((item, index: number) => (
            <div className="grid grid-cols-4 gap-4 p-4" key={index}>
              <div className="flex col-span-1">
                {cartItems[index].productImage ? (
                  <img
                    src={cartItems[index].productImage[0]}
                    alt="상품 첫 이미지"
                    className="object-cover w-16 h-16 mr-2"
                  />
                ) : null}
                <div className="grid place-items-center">
                  {item.productName}
                </div>
              </div>
              <div className="grid col-span-1 place-items-center">
                {item.productQuantity}
              </div>
              <div className="grid col-span-1 place-items-center">
                {item.productQuantity * item.productPrice} ₩
              </div>
              <div className="grid col-span-1 place-items-center">
                <input
                  type="checkbox"
                  checked={purchaseStatus[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xl font-bold">
          총 주문액:{" "}
          {cartItems
            ?.filter((_, index) => purchaseStatus[index])
            .reduce(
              (total, item) => total + item.productPrice * item.productQuantity,
              0
            )}{" "}
          ₩
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
            className="w-full p-2 mt-4 mb-6 text-white bg-blue-500"
          >
            결제하기
          </button>
        </div>
      </div>
    </>
  );
};

export default Order;
