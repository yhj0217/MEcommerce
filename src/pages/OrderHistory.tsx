import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { Order, OrderStatus } from "@/interface/Order";
import NavBar from "@/components/NavBar/NavBar";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orderGroups, setOrderGroups] = useState<Record<string, Order[]>>({});
  const [sellerNicknames, setSellerNicknames] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.id) return;

    const orderCollection = collection(db, "orders");
    const orderQuery = query(
      orderCollection,
      where("buyerId", "==", user.id),
      orderBy("createdAt", "desc")
    );
    const orderSnapshot = await getDocs(orderQuery);

    const matchedOrders = [];
    const sellerNicknameMap: Record<string, string> = {};
    for (const orderDoc of orderSnapshot.docs) {
      const orderData = {
        id: orderDoc.id,
        ...orderDoc.data(),
      } as Order;

      const userQuery = query(
        collection(db, "users"),
        where("userId", "==", orderData.sellerId)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const userDocSnapshot = userQuerySnapshot.docs[0];
        const userData = userDocSnapshot.data();
        if (userData && typeof userData.nickname === "string") {
          sellerNicknameMap[orderData.sellerId] = userData.nickname;
        }
      }

      matchedOrders.push(orderData);
    }

    setSellerNicknames(sellerNicknameMap);

    const orderGroups = matchedOrders.reduce((groups, order) => {
      const group = groups[order.orderBundle] || [];
      group.push(order);
      groups[order.orderBundle] = group;
      return groups;
    }, {} as Record<string, Order[]>);

    setOrderGroups(orderGroups);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("주문을 취소하시겠습니까?")) {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, {
        Status: OrderStatus.OrderCancelled,
      });

      fetchOrders();
    }
  };

  return (
    <>
      <NavBar />
      <div className="mx-auto">
        {Object.entries(orderGroups).map(([orderBundle, orders]) => (
          <div className="m-2 border-2 divide-y-2" key={orderBundle}>
            <div className="p-2">
              <p>주문 번호: {orders[0].orderBundle}</p>
              <p>주문 시간: {orders[0].createdAt.toDate().toLocaleString()}</p>
            </div>
            {orders.map((order, index) => (
              <div key={index}>
                <div className="grid grid-cols-2 gap-4 p-2 text-xl font-bold md:grid-cols-7">
                  <div className="col-span-2 md:col-span-2">상품 정보</div>
                  <div className="col-span-1 md:col-span-1">수량</div>
                  <div className="col-span-1 md:col-span-1">가격</div>
                  <div className="col-span-1 md:col-span-1">판매자</div>
                  <div className="col-span-1 md:col-span-1">상태</div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-2 md:grid-cols-7">
                  <div className="flex col-span-2 md:col-span-2">
                    {order.productImage ? (
                      <img
                        src={order.productImage}
                        alt="상품 이미지"
                        className="object-cover w-16 h-16 mr-2"
                      />
                    ) : null}
                    <div className="grid place-items-center">
                      {order.productName}
                    </div>
                  </div>
                  <div className="grid col-span-1 md:col-span-1 place-items-center">
                    {order.productQuantity}
                  </div>
                  <div className="grid col-span-1 md:col-span-1 place-items-center">
                    {order.productPrice} ₩
                  </div>
                  <div className="grid col-span-1 md:col-span-1 place-items-center">
                    {sellerNicknames[order.sellerId]}
                  </div>
                  <div className="grid col-span-1 md:col-span-1 place-items-center">
                    {order.Status}
                  </div>
                  {order.Status !== OrderStatus.OrderCancelled && (
                    <div className="grid col-span-1 md:col-span-1 place-items-center">
                      <button
                        className="p-2 text-white bg-red-500 rounded"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        주문 취소
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderHistory;
