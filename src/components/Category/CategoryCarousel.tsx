import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CategoryCarouselProps {
  imageUrls: string[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ imageUrls }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (api) {
      const totalImages = imageUrls.length;

      setInterval(() => {
        setCurrentIndex((currentIndex + 1) % totalImages);
        api.scrollTo(currentIndex);
      }, 3000);
    }
  }, [api, currentIndex, imageUrls.length]);

  return (
    <div>
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <Card className="w-52 h-52">
                <CardContent className="relative flex items-center justify-center p-6 aspect-square">
                  <img src={url} alt={`Selected ${index + 1}`} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
