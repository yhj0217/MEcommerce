import { useNavigate } from "react-router-dom";
import CategoryCard from "@/components/Category/CategoryCard";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { Product } from "@/interface/Product";
import { Button } from "../ui/button";

interface CategoryListProps {
  category: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const productSnapshot = await getDocs(
      query(
        collection(db, "products"),
        where("productCategory", "==", category),
        orderBy("createdAt", "desc"),
        limit(4)
      )
    );
    const newArr: Product[] = [];
    productSnapshot.forEach((doc) => {
      newArr.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });
    setProducts(newArr);
  };

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleMoreClick = () => {
    navigate(`/categories/${category}`);
  };

  return (
    <div className="relative mb-5 border rounded">
      <div className="flex items-center justify-between mb-2 border-b ">
        <h2 className="pl-2 text-xl font-semibold">{category}</h2>
        <Button
          variant="outline"
          className="px-3 py-0 border-black"
          onClick={handleMoreClick}
        >
          더보기
        </Button>
      </div>
      <div className="flex space-x-4">
        {products &&
          products.map((product, index) => (
            <CategoryCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default CategoryList;
