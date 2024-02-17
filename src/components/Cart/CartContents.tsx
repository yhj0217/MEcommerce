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
// import { Cart } from "@/interface/Cart";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cartItems: any[] = [
  // 장바구니에 들어있는 아이템 정보
];

const CartContents = () => {
  return (
    <SheetContent>
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
          {cartItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right">{item.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>총합</TableCell>
            <TableCell className="text-right">{/*총합 계산*/}</TableCell>
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
