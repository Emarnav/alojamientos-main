import { Metadata } from "next";
import SingleListing from "./Properties";

// Si quieres metadata estática por ahora:
export const metadata: Metadata = {
  title: "Alojamiento | UCH-CEU",
  description: "Información detallada sobre el alojamiento.",
};

export default function Page() {
  return <SingleListing />;
}
