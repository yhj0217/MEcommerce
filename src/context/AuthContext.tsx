import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

interface User {
  id: number;
  email: string;
  isSeller: boolean;
  nickname: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface AuthContextProps {
  user: User | null;
  isLogin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLogin: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;

        // Firestore에서 userId가 uid인 사용자 정보를 가져옵니다.
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
      setLoading(false); // 로딩 완료
    });

    // Clean up subscription
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
