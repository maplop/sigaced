import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { PhaseType } from "@renderer/utils/types"

interface AssignmentPhaseContextType {
  currentPhase: PhaseType
  setCurrentPhase: (phase: PhaseType) => void
}

const AssignmentPhaseContext = createContext<AssignmentPhaseContextType | null>(null)

export const AssignmentPhaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPhase, setCurrentPhase] = useState<PhaseType>(() => {
    const stored = localStorage.getItem('currentPhase')
    const n = stored != null ? Number(stored) : NaN
    return (n === 1 || n === 2 || n === 3) ? n : 1
  })

  useEffect(() => {
    localStorage.setItem("currentPhase", currentPhase.toString())
  }, [currentPhase])

  // Reconciliar con la BD al montar: si la fase inferida difiere de la referida en localStorage, se actualiza.
  useEffect(() => {
    const initial = currentPhase
    window.api.getInferredCurrentPhase().then((inferred) => {
      if (inferred !== initial) {
        setCurrentPhase(inferred)
      }
    }).catch(() => { })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar
  }, [])

  return (
    <AssignmentPhaseContext.Provider value={{ currentPhase, setCurrentPhase }}>{children}</AssignmentPhaseContext.Provider>
  )

}

export const useAssignmentPhase = () => {
  const context = useContext(AssignmentPhaseContext)
  if (!context) throw new Error("useAssignmentPhase debe usarse dentro de AssignmentPhaseProvider")
  return context
}

