"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { AmenityEnum, IncludedExpenseEnum} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";


const NewProperty = () => {
    const router = useRouter();
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
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
      photoUrls: [],
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (!authUser?.userInfo?.id) {
        throw new Error("No se ha encontrado el ID del propietario");
      }

      const formData = new FormData();

      data.photoUrls?.forEach((file: File) => {
        formData.append("photos", file);
      });


      // Añadir el resto de campos
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "photoUrls") {
          formData.append(key, String(value));
        }
      });

      // Importante: aquí usamos el ID interno del propietario
      formData.append("managerUsuarioId", String(authUser.userInfo.id));

      await createProperty(formData).unwrap();
      router.push("/propietario/alojamientos");
    } catch (error) {
      console.error("Error en onSubmit:", error);
    }
  };
  
  

  return (
    <div className="dashboard-container">
      <Header
        title="Añadir nuevo alojamiento"
        subtitle="Crea una nueva oferta de alojamiento con información detallada y fotos"
      />
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
              Crear oferta
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
