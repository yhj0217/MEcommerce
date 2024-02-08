import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";
import ProductCard from "@/components/Product/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/context/ProductContext";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";

interface ProductId extends Product {
  id: string;
}

const ProductList = () => {
  const [isLoading, setLoading] = useState(false);

  const { user } = useAuth();
  const fetchProducts = async ({ pageParam = null }) => {
    if (!user) {
      return [];
    }
    const productCollection = collection(db, "products");
    let productQuery = query(
      productCollection,
      where("sellerId", "==", user.id),
      orderBy("createdAt", "desc"),
      limit(2)
    );

    if (pageParam) {
      productQuery = query(
        productCollection,
        where("sellerId", "==", user.id),
        orderBy("createdAt", "desc"),
        startAfter(pageParam),
        limit(2)
      );
    }

    const productSnapshot = await getDocs(productQuery);
    return productSnapshot.docs.map((doc) => ({
      id: doc.id,
      sellerId: doc.data().sellerId,
      productName: doc.data().productName,
      productPrice: doc.data().productPrice,
      productQuantity: doc.data().productQuantity,
      productDescription: doc.data().productDescription,
      productCategory: doc.data().productCategory,
      productImage: doc.data().productImage,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
    })) as ProductId[];
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery("products", fetchProducts, {
      getNextPageParam: (lastPage = []) =>
        lastPage[lastPage.length - 1]?.createdAt,
    });

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 1.0, // 타겟 요소가 화면에 완전히 보일 때만 inView 값을 true로 설정
    rootMargin: "1px",
  });

  useEffect(() => {
    if (user && inView && hasNextPage && !isFetchingNextPage) {
      setLoading(true);
      setTimeout(() => {
        fetchNextPage();
        setLoading(false);
      }, 2000);
    }
  }, [user, inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-wrap justify-center">
      {data?.pages?.flatMap((page = [], index) =>
        page.map((product: ProductId, productIndex) => (
          <ProductCard
            key={product.id}
            product={product}
            ref={
              index === data.pages.length - 1 &&
              productIndex === page.length - 1
                ? ref
                : null
            }
          />
        ))
      )}
      {isLoading && (
        <p className="w-full font-bold text-center text-gray-600">
          상품을 불러오는 중입니다...
        </p>
      )}
    </div>
  );
};

export default ProductList;
