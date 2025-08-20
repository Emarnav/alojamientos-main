"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAdminPropertiesQuery } from "@/state/api";
import React from "react";

const Properties = () => {
  const {
    data: adminAlojamientos,
    isLoading,
    error,
  } = useGetAdminPropertiesQuery();



  if (isLoading) return <Loading />;
  if (error) return <div>Error cargando los alojamientos pendientes de revisión</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Alojamientos pendientes de revisión"
        subtitle="Gestiona los alojamientos que están pendientes de revisión."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adminAlojamientos?.map((alojamiento) => (
          <Card
            key={alojamiento.id}
            alojamiento={alojamiento}
            alojamientoLink={`/admin/alojamientos/${alojamiento.id}`}
          />
        ))}
      </div>
      {(!adminAlojamientos || adminAlojamientos.length === 0) && (
        <p>No hay ningún alojamiento pendiente de revisión</p>
      )}
    </div>
  );
};

export default Properties;
