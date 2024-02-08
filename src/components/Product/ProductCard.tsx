import React, { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/context/ProductContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductCardProps {
  product: Product;
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product }, ref) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!api) {
        return;
      }

      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);

      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    }, [api]);

    return (
      <div
        ref={ref}
        className="p-4 m-2 overflow-hidden border-2 rounded w-60 h-84"
      >
        <div className="relative flex justify-center w-52 h-52">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {product.productImage.map((img, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center"
                >
                  <div className="mr-1 border-2 rounded">
                    <div className="w-48 h-48 overflow-hidden ">
                      <img
                        src={img}
                        alt="product"
                        className="object-contain w-full h-full rounded"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-0 ml-8 transform -translate-y-1/2 top-1/2">
              <CarouselPrevious />
            </div>
            <div className="absolute right-0 transform -translate-y-1/2 mr-9 top-1/2">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          이미지 {current} of {count}
        </div>
        <Link
          to={`/mypage/product-manage/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="mt-2">
            <div className="text-xl font-bold">{product.productName}</div>
            <div className="text-gray-500">{product.productCategory}</div>
            <div className="font-bold text-red-500 ">
              {product.productPrice}₩
            </div>
            <div className="text-gray-500 ">
              재고: {product.productQuantity}개
            </div>
            <div className="h-24 border rounded">
              <div className="overflow-y-scroll hide-scroll max-h-24">
                {product.productDescription}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export default ProductCard;
