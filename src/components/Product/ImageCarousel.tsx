import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  selectedFiles,
  setSelectedFiles,
  imageUrls,
  setImageUrls,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const current = api.selectedScrollSnap() + 1;

    setCurrent(current);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);

    // cleanup function
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleRemove = (index: number) => {
    if (index < selectedFiles.length) {
      // selectedFiles에서 이미지를 삭제
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(index, 1);
      setSelectedFiles(newSelectedFiles);
    } else {
      // imageUrls에서 이미지를 삭제
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index - selectedFiles.length, 1);
      setImageUrls(newImageUrls); // setImageUrls는 상태 설정 함수입니다.
    }

    setTimeout(() => {
      setCurrent(1);
      api && api.scrollTo(0);
    }, 0);
  };

  return (
    <div>
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {selectedFiles.map((file, index) => (
            <CarouselItem key={index}>
              <Card className="w-52 h-52">
                <CardContent className="relative flex items-center justify-center p-6 aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                  />
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-0 right-0 w-6 h-6 text-white bg-red-500 rounded-full"
                  >
                    X
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
          {imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <Card className="w-52 h-52">
                <CardContent className="relative flex items-center justify-center p-6 aspect-square">
                  <img src={url} alt={`Selected ${index + 1}`} />
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-0 right-0 w-6 h-6 text-white bg-red-500 rounded-full"
                  >
                    X
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="text-sm text-center text-muted-foreground">
        이미지 {current} of {selectedFiles.length + imageUrls.length}
      </div>
    </div>
  );
};

export default ImageCarousel;
