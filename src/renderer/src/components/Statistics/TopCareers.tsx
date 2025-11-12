import { TrendingUp } from "lucide-react"
import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { TopCareer } from "src/shared/types"

interface TopCareersProps {
  topCareers?: TopCareer[]
  loadingTopCareers: boolean
}

export function TopCareers({ topCareers, loadingTopCareers }: TopCareersProps) {
  if (loadingTopCareers) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-foreground">Top 10 Carreras Más Demandadas</h3>
        </div>

        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
        </div>
      </Card>
    )
  }

  if (!topCareers || topCareers.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-foreground">Top 10 Carreras Más Demandadas</h3>
        </div>

        <div className="flex flex-col justify-center items-center text-center min-h-[250px]">
          <p className="text-sm text-muted-foreground font-medium">
            No hay carreras registradas
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-foreground">Top 10 Carreras Más Demandadas</h3>
          </div>

          <div className="space-y-3">
            {topCareers.map((career, index) => {
              const percentage = (career.totalRequests / career.totalSpots) * 100
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{career.career}</span>
                    <span className="text-xs text-muted-foreground">
                      {career.totalRequests} / {career.totalSpots}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${percentage > 100 ? "bg-orange-500" : "bg-gray-900"
                        }`}
                      style={{
                        width: career.totalSpots > 0 ? `${Math.min(percentage, 100)}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
