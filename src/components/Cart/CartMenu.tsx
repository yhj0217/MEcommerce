import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useContext } from "react";
import { CartContext } from "..//../context/CartContext";
import CartContents from "./CartContents";
import { ShoppingCart } from "lucide-react";

function CartMenu() {
  const { cartItems } = useContext(CartContext);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <NavigationMenuLink
          className={`${navigationMenuTriggerStyle()} relative`}
        >
          장바구니
          <ShoppingCart />
          {cartItems.length > 0 && (
            <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
              {cartItems.length}
            </div>
          )}
        </NavigationMenuLink>
      </SheetTrigger>
      <CartContents />
    </Sheet>
  );
}

export default CartMenu;
