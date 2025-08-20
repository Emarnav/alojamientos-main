import { Metadata } from "next";
import Home from "./(nondashboard)/home/Home";

export const metadata: Metadata = {
  title: "Inicio | UCH-CEU",
  description: "Bienvenido a la plataforma de alojamientos UCH-CEU.",
};
export default function Page() {
  return <Home />;
}
