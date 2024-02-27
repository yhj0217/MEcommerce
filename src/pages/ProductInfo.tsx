import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Product } from "@/interface/Product";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import CartContents from "@/components/Cart/CartContents";
import { useCart } from "@/context/CartContext";

const ProductInfo = () => {
  const { user } = useAuth();
  const { id } = useParams<{ [key: string]: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const { cartItems, setCartItems } = useCart();

  // isItemInCart를 상태로 새로 만들었다!
  const [isItemInCart, setIsItemInCart] = useState(false);

  // 데이터 변경시 '컨텍스트의 카트 데이터'에서 아이디를 대조한다! 그리고 상태값을 변경시켜준다!
  useEffect(() => {
    if (id) {
      const idList = cartItems.map((item) => item.productId);
      if (idList.includes(id)) setIsItemInCart(true);
      else setIsItemInCart(false);
    }
  }, [id, cartItems]);

  const fetchProduct = async () => {
    if (id) {
      const productDoc = await getDoc(doc(db, "products", id));
      if (productDoc.exists()) {
        const data = productDoc.data() as Product;
        setProduct(data);
      }
    }
  };

  const fetchRelatedProducts = async (category: string) => {
    const productCollection = collection(db, "products");
    const productQuery = query(
      productCollection,
      where("productCategory", "==", category),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const productSnapshot = await getDocs(productQuery);
    const products = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    const filteredProducts = products.filter((product) => product.id !== id);
    setRelatedProducts(filteredProducts);
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      // 상품 바뀔 때마다 첫번째 사진이니까 1을 세팅해준다.
      setCurrentImageIndex(1);
      if (carouselApi) {
        // carousel api 초기화
        carouselApi.scrollTo(0);
      }
    }
  }, [id]);

  // 이딴 건 필요가 없다.
  // const fetchCartItemIds = async () => {
  //   if (user) {
  //     const cartCollection = collection(db, "carts");
  //     const cartQuery = query(
  //       cartCollection,
  //       where("userId", "==", user.id.toString())
  //     );
  //     const cartSnapshot = await getDocs(cartQuery);
  //     const cartItemIds = cartSnapshot.docs.map((doc) => doc.data().productId);
  //     setCartItemIds(cartItemIds);
  //     return cartItemIds;
  //   }
  // };

  // useEffect(() => {
  //   fetchCartItemIds();
  // }, [user]);

  // fetchCartItemIds에서 아이디 리스트를 세팅해놓고 (setCartItemIds) cartItemIds가 변하면 다시 함수를 실행하는 게 무한로딩을 하게 만든다.
  // useEffect(() => {
  //   fetchCartItemIds();
  // }, [cartItemIds]);

  // const isItemInCart = id ? cartItemIds.includes(id) : false;

  const addToCart = async () => {
    if (product && id && user) {
      const newCartItem = {
        userId: user.id.toString(),
        sellerId: product.sellerId,
        productId: id,
        productName: product.productName,
        productImage: product.productImage,
        productPrice: product.productPrice,
        productQuantity: quantity,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "carts"), newCartItem);

      setQuantity(1);
      // setCartItemIds((prevCartItemIds) => [...prevCartItemIds, docRef.id]);

      setCartItems((prevCartItems) => [
        { ...newCartItem, id: docRef.id },
        ...prevCartItems,
      ]);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.productQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    if (product?.productCategory) {
      fetchRelatedProducts(product.productCategory);
    }
  }, [product]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCurrentImageIndex(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  return (
    <div>
      <NavBar />
      {product && (
        <div>
          <h1 className="pb-5 text-5xl font-medium">{product.productName}</h1>
          <div className="flex justify-center">
            <Carousel setApi={setCarouselApi} className="w-96 h-96">
              <CarouselContent>
                {product.productImage.map((img, index) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center justify-center w-96 h-96"
                  >
                    <img
                      src={img}
                      alt={product.productName}
                      className="object-contain w-full h-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="mt-2 text-center">
            이미지 {currentImageIndex} of {product.productImage.length}
          </div>
          <p>상품 가격: {product.productPrice}₩</p>
          <p>남은 수량: {product.productQuantity}</p>
          {!user?.isSeller && (
            <>
              <Button
                className="h-6 p-2"
                onClick={handleDecreaseQuantity}
                disabled={quantity === 1}
              >
                -
              </Button>
              <span>{quantity}</span>
              <Button
                className="h-6 p-2"
                onClick={handleIncreaseQuantity}
                disabled={quantity === product.productQuantity}
              >
                +
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button onClick={isItemInCart ? undefined : addToCart}>
                    {isItemInCart ? "장바구니 보기" : "장바구니에 추가"}
                  </Button>
                </SheetTrigger>
                <CartContents />
              </Sheet>
            </>
          )}
          <h2 className="mt-10 mb-1 border">
            다른 {product.productCategory} 상품들
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="p-4 border"
              >
                <img
                  src={relatedProduct.productImage[0]}
                  alt={relatedProduct.productName}
                  className="object-cover w-full h-64"
                />
                <h3>{relatedProduct.productName}</h3>
                <p>{relatedProduct.productPrice}₩</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
