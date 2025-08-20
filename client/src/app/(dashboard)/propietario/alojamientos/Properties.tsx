"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from "@/state/api";
import React from "react";

const Properties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: propietarioAlojamientos,
    isLoading,
    error,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error cargando los alojamientos del propietario</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Mis alojamientos"
        subtitle="Gestiona tus alojamientos"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propietarioAlojamientos?.map((alojamiento) => (
          <Card
            key={alojamiento.id}
            alojamiento={alojamiento}
            alojamientoLink={`/propietario/alojamientos/${alojamiento.id}`}
          />
        ))}
      </div>
      {(!propietarioAlojamientos || propietarioAlojamientos.length === 0) && (
        <p>No gestionas ningún alojamiento</p>
      )}
    </div>
  );
};

export default Properties;
