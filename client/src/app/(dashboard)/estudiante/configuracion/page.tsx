import { Metadata } from "next";
import StudentSettings from "./StudentSettings";

export const metadata: Metadata = {
  title: "Configuración del perfil | UCH-CEU",
  description: "Edita tus datos personales como estudiante.",
};

export default function Page() {
  return <StudentSettings />;
}
