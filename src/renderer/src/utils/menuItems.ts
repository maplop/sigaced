import { ROUTES } from "@renderer/routes/routes"
import { ChartNoAxesCombinedIcon, GraduationCap, Landmark, MapPin, Users } from "lucide-react"

// Datos del menú
export const menuItems = [
  {
    title: " Estadísiticas",
    url: ROUTES.STATISTICS,
    icon: ChartNoAxesCombinedIcon
  },
  {
    title: "Aspirantes",
    url: ROUTES.APPLICANTS,
    icon: Users
  },
  {
    title: "Carreras",
    url: ROUTES.CAREERS,
    icon: GraduationCap
  },
  {
    title: "Plazas",
    url: ROUTES.PLACES,
    icon: Landmark
  },
  {
    title: "Localización",
    url: ROUTES.LOCATION,
    icon: MapPin
  }
]
