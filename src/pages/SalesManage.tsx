import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  setDoc,
} from "@firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { Order, OrderStatus } from "@/interface/Order";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import NavBar from "@/components/NavBar/NavBar";

const SalesManage = () => {
  const { user } = useAuth();
  const [orderGroups, setOrderGroups] = useState<Record<string, Order[]>>({});
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );
  const [selectedCurrentStatus, setSelectedCurrentStatus] =
    useState<OrderStatus | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const fetchOrders = async () => {
    if (user) {
      const orderCollection = collection(db, "orders");
      const orderQuery = query(
        orderCollection,
        where("sellerId", "==", user.id),
        orderBy("createdAt", "desc")
      );
      const orderSnapshot = await getDocs(orderQuery);
      const matchedOrders = orderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      const orderGroups = matchedOrders.reduce((groups, order) => {
        const group = groups[order.orderBundle] || [];
        group.push(order);
        groups[order.orderBundle] = group;
        return groups;
      }, {} as Record<string, Order[]>);

      setOrderGroups(orderGroups);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleStatusChange = async () => {
    if (selectedOrder && selectedStatus) {
      const orderDoc = doc(db, "orders", selectedOrder);
      await setDoc(orderDoc, { Status: selectedStatus }, { merge: true });
      setSelectedOrder(null);
      setSelectedStatus(null);
      fetchOrders();
    }
  };

  const handleSelectStatus = (
    orderId: string,
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ) => {
    setSelectedOrder(orderId);
    setSelectedCurrentStatus(currentStatus); // 현재 상태 설정
    setSelectedStatus(newStatus);
    if (currentStatus !== newStatus) {
      setIsAlertDialogOpen(true); // Alert Dialog 열기
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        {Object.entries(orderGroups).map(([orderBundle, orders]) => (
          <div className="m-2 border-2 divide-y-2" key={orderBundle}>
            <div className="grid grid-cols-2 gap-4 p-2">
              <div>
                <span className="font-bold">주문 번호: </span>
                {orders[0].orderBundle}
              </div>
              <div>
                <span className="font-bold">주문 시간: </span>
                {orders[0].createdAt.toDate().toLocaleString()}
              </div>
            </div>
            {orders.map((order, index) => (
              <div key={index}>
                <div className="grid grid-cols-5 gap-4 p-2 text-xl font-bold">
                  <div className="col-span-1">상품 정보</div>
                  <div className="col-span-1">수량</div>
                  <div className="col-span-1">가격</div>
                  <div className="col-span-1">상태</div>
                  <div className="col-span-1">상태 변경</div>
                </div>
                <div className="grid grid-cols-5 gap-4 p-2 border-t">
                  <div className="flex col-span-1">
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
                  <div className="grid col-span-1 place-items-center">
                    {order.productQuantity}
                  </div>
                  <div className="grid col-span-1 place-items-center">
                    {order.productPrice} ₩
                  </div>
                  <div className="grid col-span-1 place-items-center">
                    <span
                      className={`${
                        order.Status === OrderStatus.OrderCancelled
                          ? "text-red-500 font-semibold"
                          : order.Status === OrderStatus.OrderConfirm
                          ? "text-blue-500 font-semibold"
                          : order.Status === OrderStatus.WaitingforDelivery
                          ? "text-yellow-500 font-semibold"
                          : order.Status === OrderStatus.DeliveryStarted
                          ? "text-green-500 font-semibold"
                          : order.Status === OrderStatus.SalesCompleted
                          ? "text-gray-500 font-semibold"
                          : ""
                      }`}
                    >
                      {order.Status}
                    </span>
                  </div>
                  <div className="grid col-span-1 place-items-center">
                    <Select
                      value={order.Status}
                      onValueChange={(newStatus) =>
                        handleSelectStatus(
                          order.id,
                          order.Status,
                          newStatus as OrderStatus
                        )
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={order.Status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(OrderStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        {selectedOrder &&
          selectedStatus &&
          selectedCurrentStatus !== selectedStatus && (
            <AlertDialog
              open={isAlertDialogOpen}
              onOpenChange={setIsAlertDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <button>상태 변경</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>상태 변경 확인</AlertDialogTitle>
                  <AlertDialogDescription>
                    상태를 {selectedStatus}로 변경하시겠습니까?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setSelectedOrder(null);
                      setSelectedStatus(null);
                      setSelectedCurrentStatus(null);
                    }}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleStatusChange}>
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
      </div>
    </>
  );
};

export default SalesManage;
