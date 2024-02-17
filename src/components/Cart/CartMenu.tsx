import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import CartContents from "./CartContents";

function CartMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          장바구니
        </NavigationMenuLink>
      </SheetTrigger>
      <CartContents />
    </Sheet>
  );
}

export default CartMenu;
