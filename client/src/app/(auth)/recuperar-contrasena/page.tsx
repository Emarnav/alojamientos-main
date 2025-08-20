import Auth from "../authProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña | UCH-CEU",
  description: "Recupera el acceso a tu cuenta introduciendo tu email.",
};

export default function RecuperarContrasenaPage() {
  return <Auth />;
}
