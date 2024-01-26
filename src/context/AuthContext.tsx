import React, { createContext, useState, useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

interface IAuthContext {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  accountType: "buyer" | "seller" | null;
  setAccountType: React.Dispatch<
    React.SetStateAction<"buyer" | "seller" | null>
  >;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<"buyer" | "seller" | null>(
    null
  );

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setLoggedIn(true);
        const doc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        const userData = doc.data();
        if (userData && userData.isSeller) {
          setAccountType("seller");
        } else {
          setAccountType("buyer");
        }
      } else {
        setLoggedIn(false);
        setAccountType(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, accountType, setAccountType }}
    >
      {children}
    </AuthContext.Provider>
  );
}
