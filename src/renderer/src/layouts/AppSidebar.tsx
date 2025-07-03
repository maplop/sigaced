import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@renderer/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@renderer/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@renderer/components/ui/avatar"
import { ChartNoAxesCombinedIcon, Users, MapPin, Landmark, ChevronDown, GraduationCap, LogOut, Settings, User, BarChart3 } from "lucide-react"
import { useLocation } from "react-router-dom"
import { ROUTES } from "@renderer/routes/routes"


// Datos del menú
const menuItems = [
  {
    title: " Estadísiticas",
    url: ROUTES.STATISTICS,
    icon: ChartNoAxesCombinedIcon,
  },
  {
    title: "Aspirantes",
    url: ROUTES.APPLICANTS,
    icon: Users,
  },
  {
    title: "Carreras",
    url: ROUTES.CAREERS,
    icon: GraduationCap,
  },
  {
    title: "Plazas",
    url: ROUTES.PLACES,
    icon: Landmark,
  },
  {
    title: "Localización",
    url: ROUTES.LOCATION,
    icon: MapPin,
  },
]

// Datos del usuario (esto vendría de tu estado/contexto)
const userData = {
  name: "Juan Pérez",
  email: "juan@lagunis.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

export function AppSidebar() {
  const location = useLocation()
  return (
    <Sidebar className="border-none">
      <SidebarHeader className="bg-white dark:bg-gray-950 border-none">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/statistics" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-lg truncate font-bold">GAPCED</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-gray-950">
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 data-[active=true]:bg-gray-900 data-[active=true]:text-white dark:data-[active=true]:bg-gray-100 dark:data-[active=true]:text-gray-900"
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="rounded-lg">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.name}</span>
                    <span className="truncate text-xs">{userData.email}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}