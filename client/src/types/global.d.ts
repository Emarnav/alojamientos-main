import { LucideIcon } from "lucide-react";
import { AuthUser } from "aws-amplify/auth";
import { MotionProps as OriginalMotionProps } from "framer-motion";

declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {

  enum AmenityEnum {
    WasherDryer = "WasherDryer",
    AirConditioning = "AirConditioning",
    Dishwasher = "Dishwasher",
    HighSpeedInternet = "HighSpeedInternet",
    HardwoodFloors = "HardwoodFloors",
    WalkInClosets = "WalkInClosets",
    Microwave = "Microwave",
    Refrigerator = "Refrigerator",
    Pool = "Pool",
    Gym = "Gym",
    Parking = "Parking",
    PetsAllowed = "PetsAllowed",
    WiFi = "WiFi",
  }

  enum HighlightEnum {
    HighSpeedInternetAccess = "HighSpeedInternetAccess",
    WasherDryer = "WasherDryer",
    AirConditioning = "AirConditioning",
    Heating = "Heating",
    SmokeFree = "SmokeFree",
    CableReady = "CableReady",
    SatelliteTV = "SatelliteTV",
    DoubleVanities = "DoubleVanities",
    TubShower = "TubShower",
    Intercom = "Intercom",
    SprinklerSystem = "SprinklerSystem",
    RecentlyRenovated = "RecentlyRenovated",
    CloseToTransit = "CloseToTransit",
    GreatView = "GreatView",
    QuietNeighborhood = "QuietNeighborhood",
  }

  enum PropertyTypeEnum {
    Rooms = "Rooms",
    Tinyhouse = "Tinyhouse",
    Apartment = "Apartment",
    Villa = "Villa",
    Townhouse = "Townhouse",
    Cottage = "Cottage",
  }

  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }

  interface PropertyOverviewProps {
    alojamiento: Alojamiento;
  }
  
  interface AuthProps {
    children?: React.ReactNode;
  }

  interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    alojamiento: Alojamiento;
  }

  interface ImageCarouselProps {
    images: string[];
  }

  interface ContactWidgetProps {
    alojamiento: Alojamiento;
    onOpenModal: () => void;
    onStartChat: () => void;
  }

  interface ImagePreviewsProps {
    images: string[];
  }

  interface ListingsProps {
    alojamientos?: Alojamiento[];
    isLoading: boolean;
    isError: boolean;
  }
  
  interface PropertyDetailsProps {
    alojamiento: Alojamiento;
  }

  interface PropertyLocationProps {
    alojamiento: Alojamiento;
  }



  interface CardProps {
    alojamiento: Alojamiento;
    alojamientoLink?: string;
    context?: "public" | "admin"; 
  }

  interface CardCompactProps {
    alojamiento: Alojamiento;
    alojamientoLink?: string;
  }

  interface HeaderProps {
    title: string;
    subtitle: string;
  }

  interface NavbarProps {
    isDashboard: boolean;
  }

  interface AppSidebarProps {
    userType: "Propietario" | "Estudiante" | "Admin";
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: "Propietario" | "Estudiante" | "Admin";
  }

  interface User {
    cognitoInfo: AuthUser;
    userInfo: Usuario;
    userRole: "Estudiante" | "Propietario" | "Admin";
  }
}

