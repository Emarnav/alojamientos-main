import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  Tv,
  Thermometer,
  Flame,
  Zap,
  Phone,
  Home,
  Warehouse,
  Building,
  Castle,
  Trees,
  LucideIcon,
  Microwave,
  Bed,
  LayoutGrid,
  Users,
} from "lucide-react";


export enum AmenityEnum {
  hayTelevision = "Televisión",
  hayTelefono = "Teléfono",
  hayInternet = "Internet",
  hayTerraza = "Terraza",
  hayAscensor = "Ascensor",
  hayGaraje = "Garaje",
  hayLavavajillas = "Lavavajillas",
  hayHorno = "Horno",
  hayMicroondas = "Microondas",
  hayNevera = "Nevera",
  hayLavadora = "Lavadora",
  haySecadora = "Secadora",
  hayPortero = "Portero",
  hayMuebles = "Muebles",
  hayCalefaccion = "Calefacción",
  hayAireAcondicionado = "Aire acondicionado",
  hayGas = "Gas",
  hayPiscina = "Piscina",
  hayZonaComunitaria = "Zona comunitaria",
  hayGimnasio = "Gimnasio",
}

export const AmenityIcons: Record<AmenityEnum, LucideIcon> = {
  "Televisión": Tv,
  "Teléfono": Phone,
  "Internet": Wifi,
  "Terraza": Warehouse,
  "Ascensor": LayoutGrid,
  "Garaje": Car,
  "Lavavajillas": Microwave,
  "Horno": Flame,
  "Microondas": Microwave,
  "Nevera": Thermometer,
  "Lavadora": Waves,
  "Secadora": Waves,
  "Portero": Home,
  "Muebles": Bed,
  "Calefacción": Thermometer,
  "Aire acondicionado": Thermometer,
  "Gas": Flame,
  "Piscina": Waves,
  "Zona comunitaria": Users,
  "Gimnasio": Dumbbell,
};


export enum IncludedExpenseEnum {
  aguaIncluido = "Agua",
  gasIncluido = "Gas",
  internetIncluido = "Internet",
  electricidadIncluido = "Electricidad",
}

export const IncludedExpenseIcons: Record<IncludedExpenseEnum, LucideIcon> = {
  "Agua": Waves,
  "Gas": Flame,
  "Internet": Wifi,
  "Electricidad": Zap,
};


export const PropertyTypeIcons: Record<string, LucideIcon> = {
  "Colegio Mayor": Castle,
  "Piso": Warehouse,
  "Piso Compartido": Building,
  "Residencia Familiar": Home,
  "Residencia Universitaria": Trees,
};


// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 52; // in pixels
