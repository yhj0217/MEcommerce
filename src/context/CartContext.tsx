import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { Cart } from "@/interface/Cart";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export const CartContext = createContext<{
  cartItems: Cart[];
  setCartItems: React.Dispatch<React.SetStateAction<Cart[]>>;
  fetchCartItems: () => void;
}>({ cartItems: [], setCartItems: () => {}, fetchCartItems: () => {} });

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<Cart[]>([]);

  const fetchCartItems = async () => {
    if (user?.id) {
      const cartCollection = collection(db, "carts");
      const cartQuery = query(
        cartCollection,
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      );
      const cartSnapshot = await getDocs(cartQuery);
      const carts = cartSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Cart[];
      setCartItems(carts);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
