import { Metadata } from "next";
import ManagerSettings from "./ManagerSettings";

export const metadata: Metadata = {
  title: "Configuración del perfil | Propietario | UCH-CEU",
  description: "Edita los datos de tu cuenta como propietario.",
};

export default function Page() {
  return <ManagerSettings />;
}
