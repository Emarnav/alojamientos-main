"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import {
  useGetPropertyQuery,
  useUpdatePropertyMutation,
  useGetAuthUserQuery,
  useDeletePropertyMutation,
} from "@/state/api";
import {
  AmenityEnum,
  IncludedExpenseEnum,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";



const UpdateProperty = () => {
  const { id } = useParams();
  const alojamientoId = id as string;
  const router = useRouter();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const { data: propertyData } = useGetPropertyQuery(Number(alojamientoId));

  const handleRemoveImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este alojamiento?");
    if (!confirmed) return;

    try {
      await deleteProperty(Number(alojamientoId)).unwrap();
      router.push("/propietario/alojamientos");
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error);
    }
  };

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
    },
  });

useEffect(() => {
  
  if (propertyData) {
    const { propietario, ubicacion, id, photoUrls, ...rest } = propertyData;
    form.reset({
      ...rest,
      tipoAlojamiento: rest.tipoAlojamiento as "Colegio Mayor" | "Piso" | "Piso Compartido" | "Residencia Familiar" | "Residencia Universitaria",
      estado: rest.estado as "Pendiente" | "Aprobado" | "Rechazado",
      dirigidoA: rest.dirigidoA as "Solo Chicas" | "Solo Chicos" | "Mixto",
      direccion: ubicacion?.direccion ?? "",
      ciudad: ubicacion?.ciudad ?? "",
      provincia: ubicacion?.provincia ?? "",
      codigoPostal: ubicacion?.codigoPostal ?? "",
      motivoRechazo: rest.motivoRechazo ?? "",
      photoUrls: [], 
    });

    setExistingImages(photoUrls);
  }
}, [propertyData, form]);


  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (!authUser?.userInfo?.id) {
        throw new Error("No se ha encontrado el ID del propietario");
      }

      const formData = new FormData();

      // Archivos nuevos
      if (data.photoUrls && Array.isArray(data.photoUrls)) {
        console.log("🧾 Files enviados en FormData:");
        data.photoUrls.forEach((file: File) => {
          console.log(" ->", file.name, file instanceof File);
          formData.append("photos", file);
        });

      }

      // Campos normales
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "photoUrls" && key !== "esDestacado" && key !== "estado") {
          formData.append(key, String(value));
        }
      });
      formData.append("estado", "Pendiente");

      formData.append("existingPhotos", JSON.stringify(existingImages));

      formData.append("managerUsuarioId", String(authUser.userInfo.id));
      formData.append("alojamientoId", alojamientoId);

      await updateProperty(formData).unwrap();
      router.push("/propietario/alojamientos");
    } catch (error) {
      console.error("Error al actualizar propiedad:", error);
    }
  };


  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-4">
        <Header
          title="Actualizar alojamiento"
          subtitle="Actualiza la información del alojamiento con datos detallados y fotos"
        />
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="ml-4"
        >
          Eliminar alojamiento
        </Button>
      </div>
      {propertyData?.estado === "Rechazado" && propertyData.motivoRechazo && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded-md p-4 mb-4">
          <h3 className="font-semibold mb-2">Este alojamiento ha sido rechazado</h3>
          <p className="text-sm whitespace-pre-line">MOTIVO: {propertyData.motivoRechazo}</p>
        </div>
      )}

      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={(event) => {
              form.handleSubmit(onSubmit)(event);
            }}
            className="p-4 space-y-10"
          >
            {/* Información básica */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Información básica</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CustomFormField name="nombre" label="Titulo de la oferta" className="w-full" />
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

                  />

                </div>
                <CustomFormField
                  name="descripcion"
                  label="Descripción"
                  type="textarea"
                  placeholder="Escribe una descripción detallada del alojamiento"
                />

                <div className="flex justify-between gap-4 ">
                  <CustomFormField name="ciudad" label="Localidad" className="w-full" />
                  <CustomFormField
                    name="provincia"
                    label="Provincia"
                    className="w-full"
                  />
                  <CustomFormField
                    name="codigoPostal"
                    label="Código Postal"
                    className="w-full"
                  />
                </div>
                <CustomFormField name="direccion" label="Dirección" />
                <div className="flex justify-between gap-4 ">
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

                  />

                  <CustomFormField
                    name="precio"
                    label="Precio por mes"
                    type="number"
                    className="w-full"
                  />
                  <CustomFormField
                    name="plazasLibres"
                    label="Nº de de plazas libres"
                    type="number"
                    className="w-full"
                  />
                </div>
                
              </div>

            </div>

            
            
            <hr className="my-6 border-gray-200" />
            

            {/* Amenities and Highlights */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
              Detalles del alojamiento
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between gap-4 ">
                  
                  <CustomFormField
                    name="habitaciones"
                    label="Nº de habitaciones"
                    type="number"
                    className="w-full"
                  />
                  <CustomFormField
                    name="banos"
                    label="Nº de baños"
                    type="number"
                    className="w-full"
                  />
                  <CustomFormField
                    name="superficie"
                    label="Superfície (m²)"
                    type="number"
                    className="w-full"
                  />
                </div>
                <h3 className="text-base font-semibold mb-4">Servicios</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Object.entries(AmenityEnum).map(([key, label]) => (
                    <CustomFormField
                      key={key}
                      name={key}
                      label={label}
                      type="switch"
                    />
                  ))}

                </div>
                <h3 className="text-sm font-medium mb-4">Gastos incluidos en el precio</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Object.entries(IncludedExpenseEnum).map(([key, label]) => (
                    <CustomFormField
                      key={key}
                      name={key}
                      label={label}
                      type="switch"
                    />
                  ))}
                </div>               
                <CustomFormField name="infoExtra" label="Gastos no incluidos en el precio" />

              </div>
            </div>

            <hr className="my-6 border-gray-200" />
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Imágenes actuales</h3>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((filename, idx) => (
                  <div key={idx} className="relative group">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${filename}`}
                      alt={`Imagen ${idx}`}
                      className="rounded w-full h-32 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>


            </div>

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Fotos</h2>
              <CustomFormField
                name="photoUrls"
                label="Fotos del alojamiento"
                type="file"
                accept="image/*"
              />

            </div>

            <hr className="my-6 border-gray-200" />

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
            >
              Actualizar oferta
            </Button>
          </form>
        </Form>
      </div>

    </div>
  );
};

export default UpdateProperty;
