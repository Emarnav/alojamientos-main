"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { Alojamiento } from "@/types/prismaTypes";


mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapProps {
  alojamientos?: Alojamiento[];
  isLoading: boolean;
  isError: boolean;
}

const Map = ({ alojamientos, isLoading, isError }: MapProps) => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);

  useEffect(() => {
    if (isLoading || isError || !alojamientos || alojamientos.length === 0)
      return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/emarnav/cm7n3xzne002001qu0mnw6mxb",
      center: filters.coordinates || [ -0.39, 39.5 ],
      zoom: 13,
    });

    alojamientos.forEach((alojamiento) => {
      if (
        alojamiento.ubicacion?.latitud !== 0 &&
        alojamiento.ubicacion?.longitud !== 0
      ) {
        const marker = createPropertyMarker(alojamiento, map);
        const markerElement = marker.getElement();
        const path = markerElement.querySelector("path[fill='#3FB1CE']");
        if (path) path.setAttribute("fill", "#000000");
      }
    });

    setTimeout(() => map.resize(), 700);

    return () => map.remove();
  }, [isLoading, isError, alojamientos, filters.coordinates]);

  if (isLoading) return <>Cargando mapa...</>;
  if (isError || !alojamientos) return <div>Error al cargar el mapa.</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (alojamiento: Alojamiento, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      alojamiento.ubicacion?.latitud || 0,
      alojamiento.ubicacion?.longitud || 0,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/alojamientos/${alojamiento.id}" target="_blank" class="marker-popup-title">${alojamiento.nombre}</a>
            <p class="marker-popup-price">
              ${alojamiento.precio} €
              <span class="marker-popup-price-unit"> / mes</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);

  return marker;
};

export default Map;
