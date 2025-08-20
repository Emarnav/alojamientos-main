"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import {
  useGetPropertyQuery,
  useGetAuthUserQuery,
  useApproveAlojamientoMutation,
  useRejectAlojamientoMutation,
} from "@/state/api";
import { AmenityEnum, IncludedExpenseEnum} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const CheckProperty = () => {
  const { id } = useParams();
  const alojamientoId = id as string;
  const router = useRouter();
    
  const [approveAlojamiento] = useApproveAlojamientoMutation();
  const [rejectAlojamiento] = useRejectAlojamientoMutation();
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { data: authUser } = useGetAuthUserQuery();
  const { data: propertyData } = useGetPropertyQuery(Number(alojamientoId));

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      tipoAlojamiento: undefined,
      dirigidoA: undefined,
      precio: 0,
      plazasLibres: 0,
      habitaciones: 1,
      banos: 1,
      superficie: 100,
      esDestacado: false,
      hayTelevision: false,
      hayTelefono: false,
      hayInternet: false,
      hayTerraza: false,
      hayAscensor: false,
      hayGaraje: false,
      hayLavavajillas: false,
      hayHorno: false,
      hayMicroondas: false,
      hayNevera: false,
      hayLavadora: false,
      haySecadora: false,
      hayPortero: false,
      hayMuebles: false,
      hayCalefaccion: false,
      hayAireAcondicionado: false,
      hayGas: false,
      hayPiscina: false,
      hayZonaComunitaria: false,
      hayGimnasio: false,
      aguaIncluido: false,
      gasIncluido: false,
      internetIncluido: false,
      electricidadIncluido: false,
      infoExtra: "",
      photoUrls: [],
      motivoRechazo: "",
    },
  });

  useEffect(() => {
    if (!propertyData) return;

    if (propertyData.estado !== "Pendiente") {
      router.push("/admin/alojamientos");
      return;
    }
    if (propertyData) {
      const { propietario, ubicacion, id, photoUrls, ...rest } = propertyData;
      form.reset({
        ...rest,
        motivoRechazo: rest.motivoRechazo ?? "",
        dirigidoA: rest.dirigidoA as "Solo Chicas" | "Solo Chicos" | "Mixto",
        estado: rest.estado as "Pendiente" | "Aprobado" | "Rechazado",
        tipoAlojamiento: rest.tipoAlojamiento as "Colegio Mayor" | "Piso" | "Piso Compartido" | "Residencia Familiar" | "Residencia Universitaria",
        direccion: ubicacion?.direccion ?? "",
        ciudad: ubicacion?.ciudad ?? "",
        provincia: ubicacion?.provincia ?? "",
        codigoPostal: ubicacion?.codigoPostal ?? "",
        photoUrls: [],
      });
      setExistingImages(photoUrls);
    }
  }, [propertyData]);

  const handleAprobar = async () => {
    try {
      const esDestacado = form.getValues("esDestacado") ?? false;

      await approveAlojamiento({
        id: Number(alojamientoId),
        esDestacado, 
      }).unwrap();

      router.push("/admin/alojamientos");
    } catch (error) {
      console.error("Error al aprobar alojamiento:", error);
    }
  };



  const handleRechazar = async () => {
    if (!showRejectionReason) {
      setShowRejectionReason(true);
      setTimeout(() => {
        document.getElementById("motivoRechazo")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const esDestacado = form.getValues("esDestacado") ?? false;
    const motivo = form.getValues("motivoRechazo");

    if (!motivo || motivo.trim().length < 5) {
      alert("El motivo debe tener al menos 5 caracteres");
      return;
    }

    try {
      await rejectAlojamiento({
        id: Number(alojamientoId),
        motivo,
        esDestacado,
      }).unwrap();
      router.push("/admin/alojamientos");
    } catch (error) {
      console.error("Error al rechazar alojamiento:", error);
    }
  };



  return (
    <div className="dashboard-container">
      <Header title="Revisión de alojamiento" subtitle="Consulta la información antes de aprobar o rechazar." />

      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form className="p-4 space-y-10">
            <div>
              <h2 className="text-lg font-semibold mb-4">Información básica</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CustomFormField name="nombre" label="Título de la oferta" className="w-full" disabled />
                  <CustomFormField
                    name="dirigidoA"
                    label="Dirigido a"
                    type="select"
                    className="w-1/2"
                    options={[
                      { value: "Solo Chicas", label: "Solo Chicas" },
                      { value: "Solo Chicos", label: "Solo Chicos" },
                      { value: "Mixto", label: "Mixto" },
                    ]}
                    disabled
                  />
                </div>
                <CustomFormField name="descripcion" label="Descripción" type="textarea" disabled />
                <div className="flex justify-between gap-4">
                  <CustomFormField name="ciudad" label="Localidad" className="w-full" disabled />
                  <CustomFormField name="provincia" label="Provincia" className="w-full" disabled />
                  <CustomFormField name="codigoPostal" label="Código Postal" className="w-full" disabled />
                </div>
                <CustomFormField name="direccion" label="Dirección" disabled />
                <div className="flex justify-between gap-4">
                  <CustomFormField
                    name="tipoAlojamiento"
                    label="Tipo de alojamiento"
                    type="select"
                    className="w-full"
                    options={[
                      { value: "Colegio Mayor", label: "Colegio Mayor" },
                      { value: "Piso", label: "Piso" },
                      { value: "Piso Compartido", label: "Piso Compartido" },
                      { value: "Residencia Familiar", label: "Residencia Familiar" },
                      { value: "Residencia Universitaria", label: "Residencia Universitaria" },
                    ]}
                    disabled
                  />
                  <CustomFormField name="precio" label="Precio por mes" type="number" className="w-full" disabled />
                  <CustomFormField name="plazasLibres" label="Nº de plazas libres" type="number" className="w-full" disabled />
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div>
              <h2 className="text-lg font-semibold mb-4">Detalles del alojamiento</h2>
              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <CustomFormField name="habitaciones" label="Nº de habitaciones" type="number" className="w-full" disabled />
                  <CustomFormField name="banos" label="Nº de baños" type="number" className="w-full" disabled />
                  <CustomFormField name="superficie" label="Superficie (m²)" type="number" className="w-full" disabled />
                </div>

                <h3 className="text-base font-semibold mb-4">Servicios</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Object.entries(AmenityEnum).map(([key, label]) => (
                    <CustomFormField key={key} name={key} label={label} type="switch" disabled />
                  ))}
                </div>
                <h3 className="text-sm font-medium mb-4">Gastos incluidos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Object.entries(IncludedExpenseEnum).map(([key, label]) => (
                    <CustomFormField key={key} name={key} label={label} type="switch" disabled />
                  ))}
                </div>
                <CustomFormField name="infoExtra" label="Gastos no incluidos" disabled />
              </div>
            </div>


            <hr className="my-6 border-gray-200" />

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Imágenes actuales</h3>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((filename, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${filename}`}
                      alt={`Imagen ${idx}`}
                      className="rounded w-full h-32 object-cover"
                    />                    
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-6 border-gray-200" />

            <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Destacar este alojamiento</h2>
              <p className="text-sm text-yellow-700 mb-4">Activa esta opción si quieres que este alojamiento aparezca destacado</p>
              <CustomFormField name="esDestacado" label="¿Es destacado?" type="switch" />
            </div>
            {showRejectionReason && (
              <CustomFormField
                name="motivoRechazo"
                label="Motivo del rechazo"
                type="textarea"
                placeholder="Escribe el motivo por el que se rechaza este alojamiento"
                className="scroll-mt-20"
                inputClassName="scroll-mt-20"
                key="motivoRechazo"
                // le añade el id al input interno también
              />

            )}

            <div className="flex gap-4 mt-6">
              <Button onClick={handleAprobar} className="bg-green-600 text-white w-full">Aprobar oferta</Button>
              <Button
                type="button"
                onClick={handleRechazar}
                variant="destructive"
                className="w-full"
              >
                {showRejectionReason ? "Confirmar rechazo" : "Rechazar oferta"}
              </Button>

            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckProperty;
