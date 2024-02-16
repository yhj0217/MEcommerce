import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { Product } from "@/interface/Product";
import { Link } from "react-router-dom";

const ProductInfo = () => {
  const { id } = useParams<{ [key: string]: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProduct = async () => {
    if (id) {
      const productDoc = await getDoc(doc(db, "products", id));
      if (productDoc.exists()) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = productDoc.data() as Product;
        setProduct({ id: productDoc.id, ...data });
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

    // 클라이언트 측에서 현재 상품 제거
    const filteredProducts = products.filter((product) => product.id !== id);
    setRelatedProducts(filteredProducts);
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

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
      {product && (
        <div>
          <h1 className="pb-5 text-5xl font-medium">{product.productName}</h1>
          <div className="flex justify-center">
            <Carousel setApi={setCarouselApi} className="w-96 h-96">
              <CarouselContent className="w-96 h-96">
                {product.productImage.map((img, index) => (
                  <CarouselItem key={index} className="w-96 h-96">
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
          <Button>장바구니에 추가</Button>
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
