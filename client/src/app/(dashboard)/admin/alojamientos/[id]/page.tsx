import { Metadata } from "next";
import UpdateProperty from "./UpdateProperty";

export const metadata: Metadata = {
  title: "Gestión de Estudiantes | Propietario | UCH-CEU",
  description: "Consulta los estudiantes, contratos y pagos de este alojamiento.",
};

export default function Page() {
  return <UpdateProperty />;
}
