import { ROUTES } from "@renderer/routes/routes"
import {
  ChartNoAxesCombinedIcon,
  GraduationCap,
  ListCheck,
  Landmark,
  MapPin,
  Users
} from "lucide-react"

// Datos del menú
export const menuItems = [
  {
    title: " Estadísiticas",
    url: ROUTES.STATISTICS,
    icon: ChartNoAxesCombinedIcon
  },

  {
    title: "Listado Final",
    url: ROUTES.MANUAL_ALLOCATION,
    icon: ListCheck
  }
  /*
  {
    title: "Carreras",
    url: ROUTES.CAREERS,
    icon: GraduationCap
  },
  {
    title: "Localización",
    url: ROUTES.LOCATION,
    icon: MapPin
  },
  {
    title: "Plazas",
    url: ROUTES.PLACES,
    icon: Landmark
  },
  {
    title: "Aspirantes",
    url: ROUTES.APPLICANTS,
    icon: Users
  }
    */
]
