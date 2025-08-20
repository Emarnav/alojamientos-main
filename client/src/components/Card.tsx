import { Bath, Bed, Pencil, House, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { getAbsoluteImageUrls } from "@/lib/utils";


const Card = ({
  alojamiento,
  alojamientoLink,
  context,
}: CardProps) => {
  const [imgSrc, setImgSrc] = useState(
    getAbsoluteImageUrls(alojamiento.photoUrls)[0]
  );
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full mb-5">
      <div className="relative">
        <div className="w-full h-48 relative">
          <Image
            src={imgSrc}
            alt={alojamiento.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {alojamiento.estado == "Pendiente" && (
            <span className="bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Pendiente
            </span>
          )}
          {alojamiento.estado == "Aprobado" && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Aprobado
            </span>
          )}
          {alojamiento.estado == "Rechazado" && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Rechazado
            </span>
          )}
        </div>

      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-1">
          {alojamiento.nombre}

        </h2>
        <p className="text-gray-600 mb-2">
          {alojamiento?.ubicacion?.direccion}, {alojamiento?.ubicacion?.ciudad} {alojamiento?.ubicacion?.codigoPostal}
        </p>
        <div className="text-right">
          <p className="text-lg font-bold mb-3">
            {alojamiento.precio} €
            <span className="text-gray-600 text-base font-normal"> /mes</span>
          </p>
        </div>

        <hr />
        <div className="flex justify-between items-center gap-4 text-gray-600 my-4">
          <span className="flex items-center">
            <Bed className="w-5 h-5 mr-2" />
            {alojamiento.habitaciones} hab.
          </span>
          <span className="flex items-center">
            <Bath className="w-5 h-5 mr-2" />
            {alojamiento.banos} baños
          </span>
          <span className="flex items-center">
            <House className="w-5 h-5 mr-2" />
            {alojamiento.superficie} m²
          </span>
        </div>

        <hr />
          <div className="flex justify-end gap-4 my-4">
            <Link
              href={`/alojamientos/${alojamiento.id}`}
              target="_blank"
              className="text-gray-500 hover:text-blue-600"
              title="Ver alojamiento"
            >
              <Eye className="w-5 h-5" />
            </Link>
            <Link
              href={alojamientoLink ?? "#"}
              className="text-gray-500 hover:text-blue-600"
              title="Editar alojamiento"
            >
              <Pencil className="w-5 h-5" />
            </Link>
          </div>



      </div>
    </div>
  );
};

export default Card;
