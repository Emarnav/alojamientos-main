"use client";

import { useGetAuthUserQuery, useGetPropertyQuery, useCreateOrGetConversacionMutation } from "@/state/api";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ContactWidget from "./ContactWidget";
import ImageCarousel from "./ImageCarousel";
import ChatWindow from "@/components/ChatWindow";

const SingleListing = () => {
  const { id } = useParams();
  const alojamientoId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [conversacion, setConversacion] = useState<any>(null);

  const { data: authUser } = useGetAuthUserQuery();
  const { data: alojamiento, isError, isLoading } = useGetPropertyQuery(alojamientoId);
  const [crearConversacion] = useCreateOrGetConversacionMutation();

  useEffect(() => {
    const fetchConversacion = async () => {
      if (
        showChat &&
        authUser?.userInfo?.id &&
        alojamiento?.propietario?.id &&
        !conversacion
      ) {
        try {
          const res = await crearConversacion({
            alojamientoId,
            estudianteId: authUser.userInfo.id,
            propietarioId: alojamiento.propietario.id,
          }).unwrap();
          setConversacion(res);
        } catch (error) {
          console.error("Error creando conversación:", error);
        }
      }
    };

    fetchConversacion();
  }, [showChat, authUser, alojamiento, crearConversacion, conversacion]);

  if (isLoading) return <p>Cargando...</p>;
  if (isError || !alojamiento) return <p>Alojamiento no encontrado.</p>;

  return (
    <div>
      <ImagePreviews images={alojamiento.photoUrls} />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview alojamiento={alojamiento} />
          <PropertyDetails alojamiento={alojamiento} />
          <PropertyLocation alojamiento={alojamiento} />
          <ImageCarousel images={alojamiento.photoUrls} />
        </div>

        <div className="order-1 md:order-2 space-y-4">
          <ContactWidget
            alojamiento={alojamiento}
            onOpenModal={() => setIsModalOpen(true)}
            onStartChat={() => setShowChat(true)}
          />
        </div>
      </div>

      {showChat && conversacion && (
        <ChatWindow
          conversacionId={conversacion.id}
          remitenteId={authUser?.userInfo.id}
          nombreReceptor={alojamiento.propietario?.nombre || "Propietario"}
        />
      )}
    </div>
  );
};

export default SingleListing;
