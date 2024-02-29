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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Cart } from "@/interface/Cart";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const CartContents = () => {
  const { user } = useAuth();
  const { cartItems, setCartItems } = useContext(CartContext);

  const [quantity, setQuantity] = useState<number[]>([]);
  const [originalQuantity, setOriginalQuantity] = useState<number[]>([]);
  const [cartProducts, setCartProducts] = useState<Product[]>();
  const [isQuantityChanged, setIsQuantityChanged] = useState<boolean[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removedItemIdx, setRemovedItemIdx] = useState<number | null>(null);
  const [alert, setAlert] = useState<null | string>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems?.length) {
      setQuantity(new Array(cartItems.length).fill(0));
      setOriginalQuantity(cartItems.map((cart) => cart.productQuantity));
      setIsQuantityChanged(new Array(cartItems.length).fill(false));
    }
  }, [cartItems]);

  useEffect(() => {
    const temp: number[] = [];
    cartItems?.forEach((val: Cart) => {
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

        // 장바구니 아이템의 수량을 업데이트합니다.
        setCartItems((prev) => {
          const newCartItems = [...prev];
          newCartItems[idx] = {
            ...newCartItems[idx],
            productQuantity: quantity[idx],
          };
          return newCartItems;
        });

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
      setCartProducts(validProducts); //
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

  const handleOrder = () => {
    navigate(`/order/${user?.id}`);
  };

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
      <Table className="bg-white shadow-lg table-fixed ">
        <TableCaption className="p-3 text-lg font-bold">
          장바구니에 추가된 상품 목록입니다.
        </TableCaption>
        <TableHeader className="bg-gray-100 ">
          <TableRow>
            <TableHead className="p-3 text-center">상품명</TableHead>
            <TableHead className="p-3 text-center">가격</TableHead>
            <TableHead className="p-3 text-center">수량</TableHead>
            <TableHead className="p-3 pr-3 text-right" colSpan={2}>
              합계
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems?.map((item: Cart, idx: number) => (
            <TableRow key={item.id}>
              <TableCell className="flex items-center justify-center">
                <img
                  src={cartProducts?.[idx]?.productImage[0]}
                  alt="상품 첫 이미지"
                  className="object-cover w-10 h-10 mr-2"
                />
                <div className="grid place-items-center">
                  {cartProducts?.[idx]?.productName}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {cartProducts?.[idx]?.productPrice}₩
              </TableCell>
              <TableCell
                className="text-center"
                style={{ verticalAlign: "middle" }}
              >
                <Button
                  className="h-6 p-2 mr-2"
                  onClick={() => handleDecreaseQuantity(idx)}
                  disabled={quantity[idx] === 1}
                >
                  -
                </Button>
                <span className="font-semibold">{quantity[idx]}</span>
                <Button
                  className="h-6 p-2 ml-2"
                  onClick={() => handleIncreaseQuantity(idx)}
                  disabled={
                    cartProducts?.[idx] &&
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
                  className="p-1 mr-2 text-white bg-blue-500 hover:bg-blue-600"
                >
                  변경
                </Button>
                <AlertDialog open={isDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => openDialog(idx)}
                      className="p-1 text-white bg-red-500 hover:bg-red-600"
                    >
                      삭제
                    </Button>
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
              <TableCell className="p-3 text-right">
                {cartProducts &&
                  cartProducts[idx]?.productPrice * item.productQuantity}
                ₩
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="p-3 font-bold">
              총합
            </TableCell>
            <TableCell className="p-3 text-right ">
              {cartItems?.reduce(
                (acc: number, cur: Cart) =>
                  acc + cur.productPrice * cur.productQuantity,
                0
              )}
              ₩
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <SheetFooter>
        <SheetClose asChild>
          <Button
            type="submit"
            className="text-white bg-green-500 hover:bg-green-600"
            onClick={handleOrder}
          >
            구매하기
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};
export default CartContents;
