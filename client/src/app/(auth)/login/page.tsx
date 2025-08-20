import Auth from "../authProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicia sesión | UCH-CEU",
  description: "Accede a tu cuenta para gestionar tus alojamientos o solicitudes como estudiante o propietario.",
};

export default function LoginPage() {
  return <Auth />;
}
