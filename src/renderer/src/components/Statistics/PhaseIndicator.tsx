import { Calendar, CheckCircle2, Circle } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { useAssignmentPhase } from "@renderer/context/AssignmentPhaseContext"
import { getPhaseName } from "@renderer/utils/getPhaseName"
import { formatDate } from "@renderer/utils/formatDate"

export function PhaseIndicator() {
  const { currentPhase } = useAssignmentPhase()
  const today = new Date()

  // Definimos las fases con su número y nombre
  const phases = [
    { id: 1, name: "Primer Otorgamiento" },
    { id: 2, name: "Segundo Otorgamiento" },
    { id: 3, name: "Otorgamiento Manual" },
  ].map((phase) => {
    if (phase.id < currentPhase) return { ...phase, status: "completed" }
    if (phase.id === currentPhase) return { ...phase, status: "active" }
    return { ...phase, status: "upcoming" }
  })

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Fase Actual: {getPhaseName(currentPhase)}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(today)}</span>
            </div>
          </div>

          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
            <div className="h-3 w-3 rounded-full bg-green-600 animate-pulse" />
            Activa
          </Badge>
        </div>

        <div className="flex gap-2">
          {phases.map((phase) => (
            <div key={phase.name} className="flex flex-1 items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {phase.status === "completed" && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  {phase.status === "active" && (
                    <div className="h-4 w-4 rounded-full bg-green-600 animate-pulse" />
                  )}
                  {phase.status === "upcoming" && (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}

                  <span
                    className={`text-sm font-medium ${phase.status === "active"
                      ? "text-foreground"
                      : phase.status === "completed"
                        ? "text-green-600"
                        : "text-muted-foreground"
                      }`}
                  >
                    {phase.name}
                  </span>
                </div>

                <div
                  className={`mt-2 h-2 rounded-full ${phase.status === "completed"
                    ? "bg-green-600"
                    : phase.status === "active"
                      ? "bg-green-600 animate-pulse"
                      : "bg-muted"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
