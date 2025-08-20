"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import {
  useGetAuthUserQuery,
  useCreateOrGetConversacionMutation,
  useSendMessageMutation,
} from "@/state/api";

const ContactWidget = ({ alojamiento }: ContactWidgetProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const [crearConversacion] = useCreateOrGetConversacionMutation();
  const [enviarMensaje] = useSendMessageMutation();
  const router = useRouter();
  const propietario = alojamiento?.propietario;

  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async () => {
    if (!mensaje.trim() || !authUser?.userInfo?.id || !propietario?.id) return;

    try {
      setEnviando(true);

      // Paso 1: Crear o recuperar conversación
      const conversacion = await crearConversacion({
        alojamientoId: alojamiento.id,
        estudianteId: authUser.userInfo.id,
        propietarioId: propietario.id,
      }).unwrap();

      // Paso 2: Enviar mensaje
      await enviarMensaje({
        contenido: mensaje.trim(),
        emisorId: authUser.userInfo.id,
        conversacionId: conversacion.id,
      }).unwrap();

      setMensaje("");
    } catch (error) {
      console.error("Error al iniciar conversación o enviar mensaje:", error);
    } finally {
      setEnviando(false);
    }
  };

  // Redirección si no está logueado
  if (!authUser) {
    router.push("/inicio-sesion");
    return null;
  }

  return (
    <div className="bg-white border border-primary-200 rounded-2xl p-7 h-fit min-w-[300px]">
      <div className="flex items-center gap-5 mb-4 border border-primary-200 p-4 rounded-xl">
        <div className="flex items-center p-4 bg-primary-900 rounded-full">
          <Phone className="text-primary-50" size={15} />
        </div>
        <div>
          <p>Contactar al responsable</p>
          <div className="text-lg font-bold text-primary-800">
            {propietario?.nombre ?? "Propietario"}
          </div>
        </div>
      </div>

      <div className="text-sm text-primary-600 mb-4">
        {propietario?.telefono && (
          <div>
            Teléfono: <a href={`tel:${propietario.telefono}`} className="underline">{propietario.telefono}</a>
          </div>
        )}
        {propietario?.email && (
          <div>
            Correo electrónico: <a href={`mailto:${propietario.email}`} className="underline">{propietario.email}</a>
          </div>
        )}
      </div>
      <hr />
      {authUser?.userRole === "Estudiante" && (
        <div className="flex flex-col gap-2 my-4">
          <h4 className="text-primary-800 font-semibold text-base">
            Envía un mensaje al propietario
          </h4>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
            placeholder="Escribe tu mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
          <Button
            className="bg-primary-700 text-white hover:bg-primary-600"
            onClick={handleEnviar}
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactWidget;
