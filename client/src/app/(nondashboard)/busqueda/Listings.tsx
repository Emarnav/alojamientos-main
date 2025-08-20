import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import Card from "@/components/Card";
import CardCompact from "@/components/CardCompact";
import React from "react";


const Listings = ({ alojamientos, isLoading, isError }: ListingsProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const isEstudiante = authUser?.userRole === "Estudiante";

  const { data: estudiante } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId || !isEstudiante,
    }
  );

  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);


  if (isLoading) return <>Cargando...</>;
  if (isError || !alojamientos) return <div>Error al cargar los alojamientos</div>;

  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {alojamientos.length}{" "}
        <span className="text-gray-700 font-normal">
          Ubicado en {filters.location}
        </span>
      </h3>
      <div className="flex">
        <div className="p-4 w-full">
          {alojamientos.map((alojamiento) =>
            viewMode === "grid" ? (
              <Card
                key={alojamiento.id}
                alojamiento={alojamiento}
                alojamientoLink={`/alojamientos/${alojamiento.id}`}
              />
            ) : (
              <CardCompact
                key={alojamiento.id}
                alojamiento={alojamiento}
                alojamientoLink={`/alojamientos/${alojamiento.id}`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
