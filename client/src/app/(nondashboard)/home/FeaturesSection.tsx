"use client";

import React from "react";
import Link from "next/link"; 
import { useGetPropertiesQuery } from "@/state/api";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentCard from "@/components/StudentCard";

const FeaturedSection = () => {
  const { data: alojamientos, isLoading } = useGetPropertiesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  const destacados = alojamientos?.filter((a: any) => a.esDestacado).slice(0, 6) ?? [];
  const ultimos =
    alojamientos
      ?.filter((a: any) => !a.esDestacado)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10) ?? [];

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      {destacados.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6">Alojamientos destacados</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {destacados.map((alojamiento: any) => (
              <StudentCard
                key={alojamiento.id} 
                alojamiento={alojamiento}
              />
            ))}
          </div>
        </>
      )}

      <h2 className="text-2xl font-bold mb-6">Últimos alojamientos añadidos</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ultimos.map((alojamiento: any) => (
          <StudentCard
            key={alojamiento.id} 
            alojamiento={alojamiento}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild>
          <Link href="/alojamientos">Ver todos los alojamientos</Link> 
        </Button>
      </div>
    </section>
  );
};

export default FeaturedSection;
