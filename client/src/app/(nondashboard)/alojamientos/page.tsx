import { Metadata } from "next";
import ListadoAlojamientos from "./Properties";

// Si quieres metadata estática por ahora:
export const metadata: Metadata = {
  title: "Listado de alojamientos | UCH-CEU",
  description: "Explora nuestra selección de alojamientos disponibles.",
};

export default function Page() {
  return <ListadoAlojamientos />;
}
