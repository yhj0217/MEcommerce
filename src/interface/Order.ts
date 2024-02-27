import { Timestamp } from "firebase/firestore";

export enum OrderStatus {
  OrderConfirm = "주문 확인",
  WaitingforDelivery = "배송 대기",
  DeliveryStarted = "배송 시작",
  OrderCancelled = "주문 취소",
  SalesCompleted = "판매 완료",
}

export interface Order {
  id: string;
  orderBundle: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  productName: string;
  productImage: string;
  productQuantity: number;
  productPrice: number;
  Status: OrderStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
