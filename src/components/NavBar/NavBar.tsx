import { useAuth } from "@/context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import CartMenu from "../Cart/CartMenu";

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMyPage = () => {
    navigate("/mypage");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <NavigationMenu className="flex justify-between pb-3 mb-3 border-b-2">
      <h1 onClick={handleHome} className="text-3xl font-bold cursor-pointer">
        MEcommerce
      </h1>
      <NavigationMenuList>
        {user ? (
          <>
            <h2 className="text-lg font-semibold">
              안녕하세요, {user.nickname}님
            </h2>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={handleMyPage}
                className={navigationMenuTriggerStyle()}
              >
                My Page
              </NavigationMenuLink>
            </NavigationMenuItem>
            {!user.isSeller && (
              <NavigationMenuItem>
                <CartMenu />
              </NavigationMenuItem>
            )}
          </>
        ) : (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={handleLogin}
                className={navigationMenuTriggerStyle()}
              >
                Login
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={handleSignUp}
                className={navigationMenuTriggerStyle()}
              >
                Sign Up
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavBar;
