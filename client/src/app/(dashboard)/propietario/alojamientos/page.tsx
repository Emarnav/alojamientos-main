import { Metadata } from "next";
import Properties from "./Properties";

export const metadata: Metadata = {
  title: "Mis Alojamientos | Propietario | UCH-CEU",
  description: "Consulta y gestiona los alojamientos que administras.",
};

export default function Page() {
  return <Properties />;
}
