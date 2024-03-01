import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { Product } from "@/interface/Product";
import CategoryCard from "@/components/Category/CategoryCard";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import NavBar from "@/components/NavBar/NavBar";

const Categories = () => {
  const { category } = useParams<{ [key: string]: string }>();
  const [isLoading, setLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState("createdAt/desc");
  const [orderByField, orderByDirection] = orderFilter.split("/");

  const fetchProducts = async ({ pageParam = null }) => {
    const productCollection = collection(db, "products");

    let productQuery = query(
      productCollection,
      where("productCategory", "==", category),
      orderBy(orderByField, orderByDirection as "desc" | "asc"),
      limit(4)
    );

    if (pageParam) {
      productQuery = query(
        productCollection,
        where("productCategory", "==", category),
        orderBy(orderByField, orderByDirection as "desc" | "asc"),
        startAfter(pageParam),
        limit(4)
      );
    }

    const productSnapshot = await getDocs(productQuery);
    return productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery("products", fetchProducts, {
      getNextPageParam: (lastPage = []) => {
        if (lastPage.length > 0) {
          const lastDocData = lastPage[lastPage.length - 1];
          if (orderByField === "createdAt") {
            return (lastDocData as Product).createdAt;
          } else if (orderByField === "productPrice") {
            return (lastDocData as Product).productPrice;
          }
        }
        return undefined;
      },
    });

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 1.0,
    rootMargin: "1px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      setLoading(true);
      setTimeout(() => {
        fetchNextPage();
        setLoading(false);
      }, 2000);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (orderFilter) {
      queryClient.removeQueries("products");
      refetch();
    }
  }, [orderFilter, refetch, queryClient]);

  return (
    <div>
      <NavBar />
      <div className="text-3xl font-bold">{category}</div>
      <div className="flex flex-col items-end">
        <div className="mb-4">
          <Select
            value={orderFilter}
            onValueChange={(value) => setOrderFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt/desc">최신순</SelectItem>
              <SelectItem value="productPrice/desc">높은 가격순</SelectItem>
              <SelectItem value="productPrice/asc">낮은 가격순</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap justify-between">
          {data?.pages?.flatMap((page = [], index) =>
            page.map((product: Product, productIndex) => (
              <div key={product.id} className="w-1/4">
                <CategoryCard
                  product={product}
                  ref={
                    index === data.pages.length - 1 &&
                    productIndex === page.length - 1
                      ? ref
                      : null
                  }
                />
              </div>
            ))
          )}
          {isLoading && (
            <p className="w-full font-bold text-center text-gray-600">
              상품을 불러오는 중입니다...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
