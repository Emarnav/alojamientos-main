import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, AmenityEnum } from "@/lib/constants";
import React from "react";

const PropertyDetails = ({ alojamiento }: PropertyDetailsProps) => {

  return (
    <div className="mb-6">
      {/* Comodidades */}
      <div>
      <h2 className="text-xl font-semibold my-3">Servicios del alojamiento</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Object.entries(AmenityEnum)
        .filter(([key]) => alojamiento[key])
        .map(([key, label]) => {
          const Icon = AmenityIcons[label as AmenityEnum];
          return (
            <div key={key} className="flex flex-col items-center border rounded-xl py-8 px-4">
              <Icon className="w-8 h-8 mb-2 text-gray-700" />
              <span className="text-sm text-center text-gray-700">{label}</span>
            </div>
          );
        })}


      </div>
      </div>

      {/* Sección de pestañas */}
      <div className="mt-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 mb-5">
        Tarifas y Políticas
      </h3>
      <p className="text-sm text-primary-600 dark:text-primary-300 mt-2">
        La siguiente información sobre tarifas y servicios corresponde a los datos proporcionados por el alojamiento.
      </p>
      <Tabs defaultValue="servicios-incluidos" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="servicios-incluidos">Servicios incluidos en el precio</TabsTrigger>
        <TabsTrigger value="datos-interes">Datos de interés</TabsTrigger>
        <TabsTrigger value="info-extra">Información adicional</TabsTrigger>
        </TabsList>
        <TabsContent value="servicios-incluidos" className="w-3/3">

          <div className="flex justify-between py-2">
            <span className="text-primary-700 font-medium">Internet incluido</span>
            <span className="text-primary-700">
              {alojamiento.internetIncluido ? "Sí" : "No"}
            </span>
          </div>
          <hr />
          <div className="flex justify-between py-2">
            <span className="text-primary-700 font-medium">Gas incluido</span>
            <span className="text-primary-700">
              {alojamiento.gasIncluido ? "Sí" : "No"}
            </span>
          </div>
          <hr />
          <div className="flex justify-between py-2">
            <span className="text-primary-700 font-medium">Electricidad incluida</span>
            <span className="text-primary-700">
              {alojamiento.electricidadIncluido ? "Sí" : "No"}
            </span>
          </div>
          <hr />
          <div className="flex justify-between py-2">
            <span className="text-primary-700 font-medium">Agua incluida</span>
            <span className="text-primary-700">
              {alojamiento.aguaIncluida ? "Sí" : "No"}
            </span>
          </div>
          <hr />
        </TabsContent>
        <TabsContent value="datos-interes">
        <div className="space-y-2 mt-5 mb-2">
          <p className="font-semibold">
            Habitaciones: <span className="font-normal">{alojamiento.habitaciones ?? "N/D"}</span>
          </p>
          <p className="font-semibold">
            Baños: <span className="font-normal">{alojamiento.banos ?? "N/D"}</span>
          </p>
          <p className="font-semibold">
            Superficie total: <span className="font-normal">{alojamiento.superficie ? `${alojamiento.superficie} m²` : "N/D"}</span>
          </p>
        </div>
        </TabsContent>
        <TabsContent value="info-extra">
          <p className="text-sm">
            {alojamiento.infoExtra ? alojamiento.infoExtra : "No hay información adicional disponible."}
          </p>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetails;
