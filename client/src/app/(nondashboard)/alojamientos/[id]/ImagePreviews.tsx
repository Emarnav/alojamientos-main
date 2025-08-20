"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { getAbsoluteImageUrls } from "@/lib/utils";

interface ImagePreviewsProps {
  images: string[] | string;
}


const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  // Asegura array de imágenes con URL completa
  const imageArray = getAbsoluteImageUrls(images);



  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[450px] w-full">
      {imageArray.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Imagen del alojamiento ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover cursor-pointer transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300"
        aria-label="Imagen siguiente"
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  );
};

// 🔧 Normaliza el path para evitar dobles barras: //uploads
function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export default ImagePreviews;
