import { TrendingUp } from "lucide-react"
import { Card } from "../ui/card"
import { TopCareer } from "src/shared/types"

interface TopCareersProps {
  topCareers?: TopCareer[],
  loadingTopCareers: boolean
}

export function TopCareers({ topCareers, loadingTopCareers }: TopCareersProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-foreground">Carreras Más Demandadas</h3>
          </div>
          <div className="space-y-3">
            {topCareers?.map((career, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{career.career}</span>
                  <span className="text-xs text-muted-foreground">
                    {career.totalRequests} / {career.totalSpots}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${(career.totalRequests / career.totalSpots) * 100 > 100 ? "bg-orange-500" : "bg-gray-900"}`}
                    style={{ width: `${Math.min((career.totalRequests / career.totalSpots) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
