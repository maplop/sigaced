import { DashboardStats } from "src/shared/types"
import { Card } from "../ui/card"
import { Users, Building2, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

interface KPICardsProps {
  stats?: DashboardStats
  loadingStats: boolean
}

export function KPICards({ stats, loadingStats }: KPICardsProps) {
  if (loadingStats || !stats) {
    // Puedes mostrar skeletons o placeholders aquí
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg" />
            </Card>
          ))}
      </div>
    )
  }

  // Mapeo real usando stats
  const kpis = [
    {
      title: "Aspirantes Registrados",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      trend: "+12% vs mes anterior", // opcional, puedes calcularlo si tienes historial
      trendUp: true,
    },
    {
      title: "Promedio General",
      value: stats.avgGrade.toFixed(2),
      icon: TrendingUp,
      trend: "Notas asignadas",
      trendUp: true,
    },
    {
      title: "Plazas Disponibles",
      value: stats.totalSpots.toLocaleString(),
      icon: Building2,
      trend: `${stats.totalCareers} carreras`,
      trendUp: false,
    },
    {
      title: "Plazas Asignadas",
      value: stats.assignedSpots.toLocaleString(),
      icon: CheckCircle,
      trend: ((stats.assignedSpots / stats.totalSpots) * 100).toFixed(1) + "% del total",
      trendUp: true,
    },
    {
      title: "Plazas Restantes",
      value: stats.remainingSpots.toLocaleString(),
      icon: AlertCircle,
      trend: ((stats.remainingSpots / stats.totalSpots) * 100).toFixed(1) + "% disponible",
      trendUp: null,
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
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.trend}</p>
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
