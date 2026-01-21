import { createContext, useContext, useEffect, useState } from "react"
import { PhaseType } from "@renderer/utils/types"

interface AllocationPhaseContextType {
  currentPhase: PhaseType
  setCurrentPhase: (phase: PhaseType) => void
}

const AllocationPhaseContext = createContext<AllocationPhaseContextType | null>(null)

export const AllocationPhaseProvider = ({ children }: { children: React.ReactNode }) => {
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
    <AllocationPhaseContext.Provider value={{ currentPhase, setCurrentPhase }}>{children}</AllocationPhaseContext.Provider>
  )

}

export const useAllocationPhase = () => {
  const context = useContext(AllocationPhaseContext)
  if (!context) throw new Error("useAllocationPhase debe usarse dentro de AllocationPhaseProvider")
  return context
}
