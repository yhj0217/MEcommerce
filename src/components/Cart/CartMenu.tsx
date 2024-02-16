import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cartItems: any[] = [
  // 장바구니에 들어있는 아이템 정보
];

function CartMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          장바구니
        </NavigationMenuLink>
      </SheetTrigger>
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
    </Sheet>
  );
}

export default CartMenu;
