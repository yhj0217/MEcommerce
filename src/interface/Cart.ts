import { Timestamp } from "firebase/firestore";

export interface Cart {
  id: string;
  userId: string;
  sellerId: string;
  productId: string;
  productName: string;
  productImage: string[];
  productPrice: number;
  productQuantity: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
