import { Metadata } from "next";
import SearchPage from "./SearchPage"; 

export const metadata: Metadata = {
  title: "Búsqueda de Alojamiento | UCH-CEU",
  description: "Encuentra el alojamiento perfecto para tu vida universitaria.",
};

export default function Page() {
  return <SearchPage />;
}
