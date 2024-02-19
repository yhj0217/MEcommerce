import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "@/components/ui/table";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Cart } from "@/interface/Cart";
import { useState, useEffect } from "react";
import { Product } from "@/interface/Product";
import { Alert, AlertTitle } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "../ui/alert-dialog";

const CartContents = () => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<Cart[]>();
  const [quantity, setQuantity] = useState<number[]>(
    new Array(cartItems?.length).fill(0)
  );
  const [originalQuantity, setOriginalQuantity] = useState<number[]>(
    new Array(cartItems?.length).fill(0)
  );
  const [cartProducts, setCartProducts] = useState<Product[]>();
  const [isQuantityChanged, setIsQuantityChanged] = useState<boolean[]>(
    new Array(cartItems?.length).fill(false)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removedItemIdx, setRemovedItemIdx] = useState<number | null>(null);
  const [alert, setAlert] = useState<null | string>(null);

  const fetchCartItems = async () => {
    const cartCollection = collection(db, "carts");
    const cartQuery = query(
      cartCollection,
      where("userId", "==", user?.id),
      orderBy("createdAt", "desc")
    );
    const cartSnapshot = await getDocs(cartQuery);
    const carts = cartSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Cart[];
    setOriginalQuantity(carts.map((cart) => cart.productQuantity));
    setCartItems(carts);
    await fetchProductInCart(carts);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const temp: number[] = [];
    cartItems?.forEach((val) => {
      temp.push(val.productQuantity);
    });
    setQuantity(temp);
  }, [cartItems]);

  const handleIncreaseQuantity = async (idx: number) => {
    setQuantity((prev) => {
      const newQuantity: number[] = [...prev];
      newQuantity[idx] += 1;
      setIsQuantityChanged((prev) => {
        const newIsQuantityChanged: boolean[] = [...prev];
        newIsQuantityChanged[idx] = newQuantity[idx] !== originalQuantity[idx];
        return newIsQuantityChanged;
      });
      return newQuantity;
    });
  };

  const handleDecreaseQuantity = (idx: number) => {
    setQuantity((prev) => {
      const newQuantity: number[] = [...prev];
      newQuantity[idx] -= 1;
      setIsQuantityChanged((prev) => {
        const newIsQuantityChanged: boolean[] = [...prev];
        newIsQuantityChanged[idx] = newQuantity[idx] !== originalQuantity[idx];
        return newIsQuantityChanged;
      });
      return newQuantity;
    });
  };

  const handleUpdateQuantity = async (id: string, idx: number) => {
    if (cartItems && isQuantityChanged[idx]) {
      try {
        const collectionRef = collection(db, "carts");
        const docRef = doc(collectionRef, id);
        await updateDoc(docRef, {
          productQuantity: quantity[idx],
        });
        setIsQuantityChanged((prev) => {
          const newIsQuantityChanged: boolean[] = [...prev];
          newIsQuantityChanged[idx] = false;
          return newIsQuantityChanged;
        });
        await fetchCartItems();
        setOriginalQuantity((prev) => {
          const newOriginalQuantity: number[] = [...prev];
          newOriginalQuantity[idx] = quantity[idx];
          return newOriginalQuantity;
        });
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  };

  const fetchProductInCart = async (carts: Cart[]) => {
    try {
      const productFetchPromises = carts?.map(async (val) => {
        const collectionRef = collection(db, "products");
        const docRef = doc(collectionRef, val.productId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Product;
          return data;
        }
      });

      const products = await Promise.all(productFetchPromises);
      const validProducts = products.filter(Boolean) as Product[];
      setCartProducts(validProducts);
    } catch (err) {
      console.error("Error fetching products in cart: ", err);
    }
  };

  useEffect(() => {
    if (cartItems) {
      fetchProductInCart(cartItems);
    }
  }, [cartItems]);

  const openDialog = (idx: number) => {
    setIsDialogOpen(true);
    setRemovedItemIdx(idx);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setRemovedItemIdx(null);
  };

  const handleRemoveItem = async () => {
    if (cartItems && removedItemIdx !== null) {
      try {
        const item = cartItems[removedItemIdx];
        const collectionRef = collection(db, "carts");
        const docRef = doc(collectionRef, item.id);
        await deleteDoc(docRef);
        closeDialog();
        const newCartItems = [...cartItems];
        newCartItems.splice(removedItemIdx, 1);
        setCartItems(newCartItems);
        setAlert("장바구니에서 삭제되었습니다.");
      } catch (e) {
        console.error("Error removing document: ", e);
      }
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [alert]);

  return (
    <SheetContent>
      {alert && (
        <Alert className="absolute bottom-0 right-0 text-white bg-black">
          <AlertTitle>{alert}</AlertTitle>
        </Alert>
      )}
      <SheetHeader>
        <SheetTitle>장바구니</SheetTitle>
      </SheetHeader>
      <Table>
        <TableCaption>장바구니에 추가된 상품 목록입니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>상품명</TableHead>
            <TableHead>가격</TableHead>
            <TableHead>수량</TableHead>
            <TableHead className="text-right">합계</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems?.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>
                {cartProducts && cartProducts[idx].productName}
              </TableCell>
              <TableCell>
                {cartProducts && cartProducts[idx].productPrice}₩
              </TableCell>
              <TableCell>
                <Button
                  className="h-6 p-2"
                  onClick={() => handleDecreaseQuantity(idx)}
                  disabled={quantity[idx] === 1}
                >
                  -
                </Button>
                {quantity[idx]}
                <Button
                  className="h-6 p-2"
                  onClick={() => handleIncreaseQuantity(idx)}
                  disabled={
                    cartProducts &&
                    quantity[idx] == cartProducts[idx].productQuantity
                  }
                >
                  +
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleUpdateQuantity(item.id, idx)}
                  disabled={!isQuantityChanged[idx]}
                >
                  변경
                </Button>
                <AlertDialog open={isDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button onClick={() => openDialog(idx)}>삭제</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        상품을 삭제하시겠습니까?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={closeDialog}>
                        취소
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemoveItem}>
                        삭제하기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell className="text-right">
                {cartProducts &&
                  cartProducts[idx].productPrice * item.productQuantity}
                ₩
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>총합</TableCell>
            <TableCell className="text-right">
              {cartItems?.reduce(
                (acc, cur) => acc + cur.productPrice * cur.productQuantity,
                0
              )}
              ₩
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">결제하기</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};
export default CartContents;
