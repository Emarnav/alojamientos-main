"use client";

import {
  Bath,
  Bed,
  House,
  MessageCircle,
  Eye,
  X,
  Users,
  UserCheck,
  Building
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { getAbsoluteImageUrls } from "@/lib/utils";
import ChatWindow from "@/components/ChatWindow";
import { createPortal } from "react-dom";

interface StudentCardProps {
  alojamiento: any;
  conversacionId?: number;
  remitenteId?: number;
  nombreReceptor?: string;
}

const StudentCard = ({
  alojamiento,
  conversacionId,
  remitenteId,
  nombreReceptor,
}: StudentCardProps) => {
  const [imgSrc, setImgSrc] = useState(
    getAbsoluteImageUrls(alojamiento.photoUrls)[0]
  );
  const [showChat, setShowChat] = useState(false);

  return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full mb-5">
        {/* Imagen */}
        <div className="relative w-full h-48">
          <Image
            src={imgSrc}
            alt={alojamiento.nombre}
            fill
            className="object-cover"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Título y ubicación */}
          <h2 className="text-xl font-bold mb-1">{alojamiento.nombre}</h2>
          <p className="text-gray-600 text-sm mb-2">
            {alojamiento?.ubicacion?.direccion},{" "}
            {alojamiento?.ubicacion?.ciudad} {alojamiento?.ubicacion?.codigoPostal},{" "}
            {alojamiento?.ubicacion?.provincia}
          </p>

          {/* Precio */}
          <div className="text-right">
            <p className="text-lg font-bold mb-3">
              {alojamiento.precio} €
              <span className="text-gray-600 text-sm font-normal"> /mes</span>
            </p>
          </div>

          {/* Info general */}
          <div className="text-sm text-gray-700 flex justify-between mb-4">
            <span className="flex items-center gap-1">
              <Building className="w-4 h-4" /> {alojamiento.tipoAlojamiento}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {alojamiento.dirigidoA}
            </span>
            <span className="flex items-center">
              <House className="w-4 h-4 gap-1" />
              {alojamiento.superficie} m²
            </span>

            <span className="flex items-center">
              <UserCheck className="w-4 h-4 gap-1" />
              {alojamiento.plazasLibres} plazas disp.
            </span>
          </div>

          <hr />

          {/* Acciones */}
          <div className="flex justify-between items-center mt-4">
            <Link
                href={`/alojamientos/${alojamiento.id}`}
                target="_blank"
                className="text-sm hover:underline flex items-center gap-1"
            >
                <Eye className="w-4 h-4" />
                Ver alojamiento
            </Link>

            {conversacionId && (
                <button
                onClick={() => setShowChat(true)}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                <MessageCircle className="w-4 h-4" />
                Abrir chat
                </button>
            )}
          </div>  

        </div>
        {/* Modal de chat */}
        {showChat && conversacionId !== undefined &&
          createPortal(
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="relative w-full max-w-2xl mx-auto">
                <button
                  onClick={() => setShowChat(false)}
                  className="absolute top-2 right-2 text-white bg-black/70 rounded-full p-1 hover:bg-black"
                >
                  <X className="w-5 h-5" />
                </button>
                <ChatWindow
                  conversacionId={conversacionId}
                  remitenteId={remitenteId!}
                  nombreReceptor={nombreReceptor!}
                />
              </div>
            </div>,
            document.body
          )
        }
      </div>
  );
};

export default StudentCard;
