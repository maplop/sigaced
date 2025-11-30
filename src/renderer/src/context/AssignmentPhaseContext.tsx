import { createContext, useContext, useEffect, useState } from "react";
import { PhaseType } from "@renderer/utils/types";


interface AssignmentPhaseContextType {
  currentPhase: PhaseType
  setCurrentPhase: (phase: PhaseType) => void
}

const AssignmentPhaseContext = createContext<AssignmentPhaseContextType | null>(null)

export const AssignmentPhaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPhase, setCurrentPhase] = useState<PhaseType>(() => {
    const stored = localStorage.getItem('currentPhase')
    return stored ? (Number(stored) as PhaseType) : 1
  })

  useEffect(() => {
    localStorage.setItem("currentPhase", currentPhase.toString())
  }, [currentPhase])

  return (
    <AssignmentPhaseContext.Provider value={{ currentPhase, setCurrentPhase }}>{children}</AssignmentPhaseContext.Provider>
  )

}

export const useAssignmentPhase = () => {
  const context = useContext(AssignmentPhaseContext)
  if (!context) throw new Error("useAssignmentPhase debe usarse dentro de AssignmentPhaseProvider")
  return context
}

