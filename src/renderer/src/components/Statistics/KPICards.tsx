import { DashboardStats } from "src/shared/types"
import { Card } from "../ui/card"
import { Users, Building2, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

interface KPICardsProps {
  stats?: DashboardStats
  loadingStats: boolean
}

export function KPICards({ stats, loadingStats }: KPICardsProps) {
  const kpis = [
    {
      title: "Aspirantes Registrados",
      value: stats?.totalStudents?.toLocaleString() ?? 0,
      icon: Users,
      trend: "fase seleccionada",
    },
    {
      title: "Promedio General",
      value: stats?.avgGrade?.toFixed(2) ?? 0.00,
      icon: TrendingUp,
      trend: "del total",
    },
    {
      title: "Plazas Disponibles",
      value: stats?.totalSpots?.toLocaleString() ?? 0,
      icon: Building2,
      trend: `${stats?.totalCareers ?? 0} carreras`,
    },
    {
      title: "Plazas Asignadas",
      value: stats?.assignedSpots?.toLocaleString() ?? 0,
      icon: CheckCircle,
      trend:
        stats && stats.totalSpots > 0
          ? ((stats.assignedSpots / stats.totalSpots) * 100).toFixed(1) + "% del total"
          : "No disponible",
    },
    {
      title: "Plazas Restantes",
      value: stats?.remainingSpots?.toLocaleString() ?? 0,
      icon: AlertCircle,
      trend:
        stats && stats.totalSpots > 0
          ? ((stats.remainingSpots / stats.totalSpots) * 100).toFixed(1) + "% disponible"
          : "No disponible",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.title} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>

                {loadingStats ? (
                  <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                )}

                {loadingStats ? (
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                ) : (
                  <p className="text-xs text-muted-foreground">{kpi.trend}</p>
                )}
              </div>

              <div className="rounded-lg bg-gray-900 p-3">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
