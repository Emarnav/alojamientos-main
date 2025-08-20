import { MapPin, Star } from "lucide-react";
import React from "react";

const PropertyOverview = ({ alojamiento }: PropertyOverviewProps) => {

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold my-5">{alojamiento.nombre}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {alojamiento.ubicacion?.direccion},{alojamiento.ubicacion?.ciudad} {alojamiento.ubicacion?.codigoPostal}, {alojamiento.ubicacion?.provincia},{" "}
            {alojamiento.ubicacion?.pais}
          </span>
          {alojamiento.esDestacado && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-green-600">Anuncio destacado</span>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="border border-primary-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Dirigido a</div>
            <div className="font-semibold">
              {alojamiento.dirigidoA}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Tipo</div>
            <div className="font-semibold">
              {alojamiento.tipoAlojamiento}
            </div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Precio</div>
            <div className="font-semibold">{alojamiento.precio}€/mes</div>
          </div>
          <div className="border-l border-gray-300 h-10"></div>
          <div>
            <div className="text-sm text-gray-500">Plazas Disponibles</div>
            <div className="font-semibold">{alojamiento.plazasLibres}</div>
          </div>

        </div>
      </div>

      {/* Summary */}
      <div className="my-16">
        <h2 className="text-xl font-semibold mb-5">Descripción</h2>
        <p className="text-gray-500 leading-7">
          {alojamiento.descripcion}
        </p>
      </div>
    </div>
  );
};

export default PropertyOverview;
