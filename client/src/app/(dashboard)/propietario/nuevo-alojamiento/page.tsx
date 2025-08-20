import { Metadata } from "next";
import NewProperty from "./NewProperty";

export const metadata: Metadata = {
  title: "Nuevo Alojamiento | UCH-CEU",
  description: "Publica una nueva oferta de alojamiento con fotos y servicios detallados.",
};

export default function Page() {
  return <NewProperty />;
}
