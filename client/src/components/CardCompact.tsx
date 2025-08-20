import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CardCompact = ({
  alojamiento,
  alojamientoLink,
}: CardCompactProps) => {
  const [imgSrc, setImgSrc] = useState(
    alojamiento.photoUrls?.[0] || "/placeholder.jpg"
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full flex h-40 mb-5">
      <div className="relative w-1/3">
        <Image
          src={imgSrc}
          alt={alojamiento.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
        />
        <div className="absolute bottom-2 left-2 flex gap-1 flex-col">
          {alojamiento.isPetsAllowed && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full w-fit">
              Pets
            </span>
          )}
          {alojamiento.isParkingIncluded && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Parking
            </span>
          )}
        </div>
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold mb-1">
              {alojamientoLink ? (
                <Link
                  href={alojamientoLink}
                  className="hover:underline hover:text-blue-600"
                  scroll={false}
                >
                  {alojamiento.nombre}
                </Link>
              ) : (
                alojamiento.nombre
              )}
            </h2>
          </div>
          <p className="text-gray-600 mb-1 text-sm">
            {alojamiento?.location?.address}, {alojamiento?.location?.city}
          </p>
          <div className="flex text-sm items-center">
            <Star className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="font-semibold">
              {alojamiento.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-1">
              ({alojamiento.numberOfReviews})
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-2 text-gray-600">
            <span className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {alojamiento.habitaciones}
            </span>
            <span className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {alojamiento.banos}
            </span>
            <span className="flex items-center">
              <House className="w-4 h-4 mr-1" />
              {alojamiento.perimetro}
            </span>
          </div>

          <p className="text-base font-bold">
            ${alojamiento.precio.toFixed(0)}
            <span className="text-gray-600 text-xs font-normal"> /mes</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardCompact;
