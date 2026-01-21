import { ROUTES } from "@renderer/routes/routes"
import {
  ChartNoAxesCombinedIcon,
  ListCheck
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
]
