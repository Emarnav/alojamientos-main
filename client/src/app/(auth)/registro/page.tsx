import Auth from "../authProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regístrate | UCH-CEU",
  description: "Crea una cuenta nueva para acceder a las funcionalidades como estudiante o propietario.",
};

export default function RegistroPage() {
  return <Auth />;
}
