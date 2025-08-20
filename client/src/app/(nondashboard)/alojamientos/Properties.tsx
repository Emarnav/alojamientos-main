"use client";

import { useGetPropertiesQuery } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { setFilters } from "@/state";
import { cleanParams, getAbsoluteImageUrls } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import FiltersFull from "./FiltersFull";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const ListadoAlojamientos = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.global.filters);
  const [filtersReady, setFiltersReady] = useState(false);

  // Cargar filtros desde URL al montar
  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "rangoPrecio" || key === "superficie") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }
        return acc;
      },
      {}
    );

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
    setFiltersReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // No lanzar la query hasta que tengamos filtros cargados
  const {
    data: alojamientos,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters, {
    skip: !filtersReady,
  });

  if (!filtersReady) return <p className="px-5 py-10">Cargando filtros...</p>;

  return (
    <div className="w-full min-h-screen px-5 py-4 flex gap-6">
      {/* Filtros a la izquierda */}
      <div className="w-4/12">
        <div className="sticky top-5 max-h-[calc(100vh-40px)] overflow-auto">
          <FiltersFull forceOpen />
        </div>
      </div>

      {/* Resultados a la derecha */}
      <div className="w-8/12 flex flex-col gap-8">
        {isLoading && <p>Cargando alojamientos...</p>}
        {isError || !alojamientos ? (
          <p>Error al cargar alojamientos.</p>
        ) : (
          <>
            <h2 className="text-xl font-bold">
              {alojamientos.length} alojamientos encontrados
            </h2>

            {alojamientos.map((alojamiento) => {
              const imageUrls = getAbsoluteImageUrls(alojamiento.photoUrls);

              return (
                <div
                  key={alojamiento.id}
                  className="bg-white rounded-2xl shadow border p-5 flex flex-col md:flex-row gap-6"
                >
                  {/* Imágenes lado izquierdo */}
                  <div className="w-full md:w-1/2 flex flex-col gap-2 max-h-[350px]">
                    <div className="relative flex-grow basis-[60%] min-h-[120px] overflow-hidden rounded-md">
                      <Image
                        src={imageUrls[0]}
                        alt={`Imagen 1 de ${alojamiento.nombre}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-grow basis-[40%] gap-2 min-h-[100px]">
                      {imageUrls.slice(1, 3).map((url, i) => (
                        <div
                          key={i}
                          className="relative w-1/2 rounded-md overflow-hidden"
                        >
                          <Image
                            src={url}
                            alt={`Imagen ${i + 2} de ${alojamiento.nombre}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info lado derecho */}
                  <div className="w-full md:w-1/2 flex flex-col justify-between space-y-3 text-sm text-gray-700">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-black">
                        {alojamiento.nombre}
                      </h3>
                      <p>
                        <strong>Dirección:</strong>{" "}
                        {alojamiento.ubicacion?.direccion},{" "}
                        {alojamiento.ubicacion?.ciudad},{" "}
                        {alojamiento.ubicacion?.provincia}
                      </p>

                      <p>
                        <strong>Superficie:</strong> {alojamiento.superficie} m²
                      </p>
                      <p>
                        <strong>Precio:</strong> {alojamiento.precio} €/mes
                      </p>
                      <p>
                        <strong>Plazas libres:</strong>{" "}
                        {alojamiento.plazasLibres}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {alojamiento.tipoAlojamiento}
                      </p>
                      <p>
                        <strong>Dirigido a:</strong> {alojamiento.dirigidoA}
                      </p>
                      {alojamiento.infoExtra && (
                        <p>
                          <strong>Info extra:</strong> {alojamiento.infoExtra}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[ 
                        ["hayInternet", "Internet"],
                        ["hayTerraza", "Terraza"],
                        ["hayLavadora", "Lavadora"],
                        ["hayMuebles", "Amueblado"],
                        ["hayAireAcondicionado", "A/C"],
                        ["aguaIncluido", "Agua incluida"],
                        ["gasIncluido", "Gas incluida"],
                        ["electricidadIncluido", "Luz incluida"],
                      ].map(([key, label]) =>
                        alojamiento[key as keyof typeof alojamiento] ? (
                          <Badge key={key}>{label}</Badge>
                        ) : null
                      )}
                    </div>

                    <div className="flex justify-end mt-4">
                      <a
                        href={`/alojamientos/${alojamiento.id}`}
                        className="inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
                      >
                        Ver más detalles
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ListadoAlojamientos;
