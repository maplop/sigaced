import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { PhaseSelectorType } from "./useStatisticsVew"

interface PhaseSelectorProps {
  selectedPhase: PhaseSelectorType,
  handlePhaseSelector: (phase: PhaseSelectorType) => void
}

export function PhaseSelector({ selectedPhase, handlePhaseSelector }: PhaseSelectorProps) {
  const phases = [
    { id: "all" as PhaseSelectorType, label: "Todas las Fases" },
    { id: 1 as PhaseSelectorType, label: "Fase 1: Primer Otorgamiento" },
    { id: 2 as PhaseSelectorType, label: "Fase 2: Segundo Otorgamiento" },
    { id: 3 as PhaseSelectorType, label: "Fase 3: Otorgamiento Manual" },
  ]

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Filtrar Estadísticas por Fase</h3>
        <div className="flex flex-wrap gap-2">
          {phases.map((phase) => (
            <Button
              key={phase.id}
              variant={selectedPhase === phase.id ? "default" : "outline"}
              onClick={() => handlePhaseSelector(phase.id)}
              className="flex-1"
            >
              {phase.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
