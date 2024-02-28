import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Order } from "@/interface/Order";

const OrderDetail = () => {
  const { uid, oid } = useParams<{ uid: string; oid: string }>();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    const orderCollection = collection(db, "orders");
    const orderQuery = query(
      orderCollection,
      where("buyerId", "==", uid),
      where("orderBundle", "==", oid),
      orderBy("createdAt", "desc")
    );
    const orderSnapshot = await getDocs(orderQuery);
    const matchedOrders = orderSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    setOrders(matchedOrders);
  };

  useEffect(() => {
    fetchOrder();
  }, [uid, oid]);

  if (!orders) {
    return <div>Error : 주문 정보가 없습니다.</div>;
  }

  const totalAmount = orders.reduce(
    (total, order) => total + order.productPrice * order.productQuantity,
    0
  );

  const goToHome = () => {
    navigate("/");
  };
  const goToOrderHistory = () => {
    navigate("/mypage/orderhistory");
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-4 text-2xl font-bold">주문이 완료 되었습니다!</h1>
      <div className="border-2 divide-y-2">
        <div className="grid grid-cols-3 gap-4 p-4 text-xl font-bold">
          <div className="col-span-1">주문 상품 정보</div>
          <div className="col-span-1">수량</div>
          <div className="col-span-1">가격</div>
        </div>

        {orders.map((order, index: number) => (
          <div className="grid grid-cols-3 gap-4 p-4" key={index}>
            <div className="flex col-span-1">
              {order.productImage ? (
                <img
                  src={order.productImage}
                  alt="상품 이미지"
                  className="object-cover w-16 h-16 mr-2"
                />
              ) : null}
              <div className="grid place-items-center">{order.productName}</div>
            </div>
            <div className="grid col-span-1 place-items-center">
              {order.productQuantity}
            </div>
            <div className="grid col-span-1 place-items-center">
              {order.productQuantity * order.productPrice} ₩
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xl font-bold">총 주문액: {totalAmount} ₩</div>
      <button
        className="p-2 mt-4 text-white bg-blue-500 rounded"
        onClick={goToHome}
      >
        홈으로 이동하기
      </button>
      <button
        className="p-2 mt-4 ml-10 text-white bg-blue-500 rounded"
        onClick={goToOrderHistory}
      >
        구매 내역으로 이동하기
      </button>
    </div>
  );
};

export default OrderDetail;
