import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import ProductCard from "@/components/Product/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/context/ProductContext";

interface ProductId extends Product {
  id: string;
}

const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductId[]>([]);

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        const productCollection = collection(db, "products");
        const productQuery = query(
          productCollection,
          where("sellerId", "==", user.id),
          orderBy("createdAt", "desc")
        );
        const productSnapshot = await getDocs(productQuery);
        const fetchedProducts: ProductId[] = productSnapshot.docs.map(
          (doc) => ({
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
          })
        ) as ProductId[];
        setProducts(fetchedProducts);
      };
      fetchProducts();
    }
  }, [user]);

  return (
    <div className="flex flex-wrap justify-center">
      {products.map((product: ProductId) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
