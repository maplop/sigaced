import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@renderer/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@renderer/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@renderer/components/ui/avatar"
import { ChartNoAxesCombinedIcon, ChevronDown, FileCheck, FileCheck2, FileText, GraduationCap, ListCheck, LogOut, MapPin, User, Users } from "lucide-react"
import { useLocation } from "react-router-dom"
import { ROUTES } from "@renderer/routes/routes"
import { useAuthContext } from "@renderer/context/AuthContext"
import { Separator } from "@renderer/components/ui/separator"
import { useAssignmentPhase } from "@renderer/context/AssignmentPhaseContext"
import { useState } from "react"
import GAPCEDInfoDialog from "./GapcedInfoDialog"

const menuItems = [
  {
    title: "Estadísiticas",
    url: ROUTES.STATISTICS,
    icon: ChartNoAxesCombinedIcon
  },
  {
    title: "Carreras",
    url: ROUTES.CAREERS,
    icon: GraduationCap
  },
  {
    title: "Ubicación",
    url: ROUTES.LOCATION,
    icon: MapPin
  },
]

const allocations = [
  {
    title: "Primer Otorgamiento",
    url: ROUTES.FIRST_ALLOCATION,
    icon: FileCheck
  },
  {
    title: "Segundo Otorgamiento",
    url: ROUTES.SECOND_ALLOCATION,
    icon: FileCheck
  },
  {
    title: "Otorgamiento Manual",
    url: ROUTES.MANUAL_ALLOCATION,
    icon: FileCheck2
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { logout, user } = useAuthContext()
  const { currentPhase } = useAssignmentPhase()

  const [openInfo, setOpenInfo] = useState<boolean>(false);
  return (
    <Sidebar className="border-none">
      <SidebarHeader className="bg-white dark:bg-gray-950 border-none">
        <SidebarMenu>
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                <GraduationCap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-lg truncate font-bold">GAPCED</span>
              </div>
            </div>

            <GAPCEDInfoDialog open={openInfo} onOpenChange={setOpenInfo} />
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-gray-950">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 data-[active=true]:bg-gray-900 data-[active=true]:text-white dark:data-[active=true]:bg-gray-100 dark:data-[active=true]:text-gray-900"
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Separator />
              {allocations.map((item, index) => {
                const isActive = location.pathname === item.url

                const phaseNumber = index + 1;
                const dotClass = phaseNumber === currentPhase
                  ? "bg-green-600 animate-pulse"
                  : phaseNumber < currentPhase
                    ? "bg-green-600"
                    : "bg-gray-400";
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
                        <span className={`h-2 w-2 rounded-full ml-auto ${dotClass}`} />
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <Separator />
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === ROUTES.FINAL_LIST}
                  className="hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 data-[active=true]:bg-gray-900 data-[active=true]:text-white dark:data-[active=true]:bg-gray-100 dark:data-[active=true]:text-gray-900"
                >
                  <a href={ROUTES.FINAL_LIST}>
                    <ListCheck />
                    <span>Listado Final</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator />
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === ROUTES.REPORTS}
                  className="hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 data-[active=true]:bg-gray-900 data-[active=true]:text-white dark:data-[active=true]:bg-gray-100 dark:data-[active=true]:text-gray-900"
                >
                  <a href={ROUTES.REPORTS}>
                    <FileText />
                    <span>Reportes PDF</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.username}</span>
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
                  <a href={ROUTES.PROFILE} className="flex items-center gap-2 w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </a>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem>
                    <a href={ROUTES.MANAGE_USERS} className="flex items-center gap-2 w-full">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Gestionar usuarios</span>
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={logout}>
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