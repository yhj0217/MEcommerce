import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export interface Product {
  id: string;
  sellerId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productDescription: string;
  productCategory: string;
  productImage: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface User {
  id: number;
  email: string;
  isSeller: boolean;
  nickname: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProductContextProps {
  user: User | null;
  isLogin: boolean;
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  products: Product[]; // 상품 상태 추가
  setProducts: (products: Product[]) => void; // products 상태를 변경하는 함수 추가
}

export const ProductContext = createContext<ProductContextProps>({
  user: null,
  isLogin: false,
  loading: true,
  addProduct: async () => {},
  products: [],
  setProducts: () => {}, // 초기값 설정
});

export const useProduct = () => useContext(ProductContext);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]); // products 상태 추가

  const addProduct = async (product: Product) => {
    await addDoc(collection(db, "products"), product);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;

        const q = query(collection(db, "users"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setUser({
            id: data.userId,
            email: data.email,
            isSeller: data.isSeller,
            nickname: data.nickname,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setIsLogin(true);
      } else {
        setUser(null);
        setIsLogin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <ProductContext.Provider
      value={{ user, isLogin, loading, addProduct, products, setProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};
