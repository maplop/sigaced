import { SidebarProvider, SidebarTrigger, SidebarInset } from "@renderer/components/ui/sidebar"
import { Separator } from "@renderer/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
} from "@renderer/components/ui/breadcrumb"
import { AppSidebar } from "./AppSidebar"
import { Outlet, useLocation } from "react-router-dom"
import { ROUTES } from "@renderer/routes/routes"

interface BreadcrumbData {
  name: string
  path: string
  isLast?: boolean
}

// Función para generar los breadcrumbs a partir del pathname
const generateBreadcrumbs = (pathname: string): BreadcrumbData[] => {
  const paths = pathname.split("/").filter(Boolean)

  const routeNames: Record<string, string> = {
    statistics: "Estadísticas",
    applicants: "Aspirantes",
    careers: "Carreras",
    places: "Plazas",
    location: "Localización",
    profile: "Perfil",
    "manage-users": 'Gestionar usuarios'
  }

  const breadcrumbs: BreadcrumbData[] = [{ name: "Inicio", path: ROUTES.STATISTICS }]

  let currentPath = ""
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const name = routeNames[path] ?? path.charAt(0).toUpperCase() + path.slice(1)
    breadcrumbs.push({
      name,
      path: currentPath,
      isLast: index === paths.length - 1,
    })
  })

  return breadcrumbs
}

const MainLayout = () => {
  const location = useLocation()
  const breadcrumbs = generateBreadcrumbs(location.pathname)
  console.log("bradcrubns -- ", breadcrumbs)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className="hidden md:block">
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.path}>{crumb.name}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 rounded-tl-2xl p-4 pt-0 h-[calc(100vh-4rem)] overflow-auto bg-gradient-to-br from-blue-50 to-indigo-50">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout
