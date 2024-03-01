import { useAuth } from "@/context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useNavigate, useLocation } from "react-router-dom";
import CartMenu from "../Cart/CartMenu";
import { Link } from "react-router-dom";
import MEcommerce from "@/assets/MEcommerce.webp";

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMyPage = () => {
    navigate("/mypage");
  };

  const isOrderPage = location.pathname.includes("/order/");
  const signUpPage = location.pathname.includes("/signup");
  const loginPage = location.pathname.includes("/login");
  const myPage = location.pathname.includes("/mypage");

  return (
    <NavigationMenu className="flex justify-between h-10 pb-3 mb-3 border-b-2">
      <Link to="/">
        <img
          src={MEcommerce}
          alt="MEcommerce logo"
          className="text-3xl font-bold cursor-pointer"
        />
      </Link>
      <NavigationMenuList>
        {user ? (
          <>
            <h2 className="text-lg font-semibold">
              {isOrderPage
                ? "상품 구매 페이지입니다."
                : myPage
                ? `${user.nickname}님의 마이페이지입니다.`
                : `안녕하세요, ${user.nickname}님`}
            </h2>
            {!myPage && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={handleMyPage}
                  className={navigationMenuTriggerStyle()}
                >
                  마이 페이지
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {!user.isSeller && !isOrderPage && (
              <NavigationMenuItem>
                <CartMenu />
              </NavigationMenuItem>
            )}
          </>
        ) : (
          !signUpPage &&
          !loginPage && (
            <>
              <NavigationMenuItem>
                <Link to="/login" className={navigationMenuTriggerStyle()}>
                  로그인
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/signup" className={navigationMenuTriggerStyle()}>
                  회원가입
                </Link>
              </NavigationMenuItem>
            </>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavBar;
