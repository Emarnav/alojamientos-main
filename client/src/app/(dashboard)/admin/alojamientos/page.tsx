import { Metadata } from "next";
import Properties from "./Properties";

export const metadata: Metadata = {
  title: "Alojamientos pendientes de revisión | UCH-CEU",
  description: "Consulta y gestiona los alojamientos pendientes de revisión.",
};

export default function Page() {
  return <Properties />;
}
