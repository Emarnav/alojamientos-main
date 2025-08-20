"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { getAbsoluteImageUrls } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [imgSrcs, setImgSrcs] = useState(getAbsoluteImageUrls(images));
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleError = (index: number) => {
    setImgSrcs((prev) =>
      prev.map((src, i) => (i === index ? "/placeholder.jpg" : src))
    );
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {imgSrcs.map((src, index) => (
                <CarouselItem key={index} className="relative h-64 w-full">
                  <Image
                    src={src}
                    alt={`Alojamiento imagen ${index + 1}`}
                    fill
                    className="object-cover rounded-lg cursor-pointer"
                    onError={() => handleError(index)}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsOpen(true);
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={imgSrcs.map((src) => ({ src }))}
        index={currentIndex}
      />
    </>
  );
};

export default ImageCarousel;
