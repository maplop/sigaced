import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  clearAllTables,
  getDashboardStats,
  getTopCareers,
  getTopApplicants
} from "@renderer/api/statistics"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useState } from "react"
import { toast } from "sonner"
import { useAllocationPhase } from "@renderer/context/AllocationPhaseContext"

export type PhaseSelectorType = "all" | 1 | 2 | 3

export const useStatisticsView = () => {
  const queryClient = useQueryClient()

  const { setCurrentPhase } = useAllocationPhase()

  const [selectedPhase, setSelectedPhase] = useState<PhaseSelectorType>("all")

  const phaseId = selectedPhase === "all" ? undefined : Number(selectedPhase)

  const handlePhaseSelector = (phase: PhaseSelectorType) => {
    setSelectedPhase(phase)
  }

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: [rqKeys.ALLOCATIONS, rqKeys.SPOT, rqKeys.APPLICANTS, phaseId],
    queryFn: () => getDashboardStats(phaseId)
  })

  const { data: topCareers, isLoading: loadingTopCareers } = useQuery({
    queryKey: [rqKeys.CAREERS, rqKeys.SPOT, rqKeys.APPLICANTS, phaseId],
    queryFn: () => getTopCareers(phaseId)
  })

  const { data: topApplicants, isLoading: loadingTopApplicants } = useQuery({
    queryKey: [rqKeys.APPLICANTS, rqKeys.ALLOCATIONS, phaseId],
    queryFn: () => getTopApplicants(phaseId)
  })

  // Mutation para limpiar todas las tablas
  const clearAllTablesMutation = useMutation({
    mutationFn: () => clearAllTables(),
    onSuccess: () => {
      // Refresca todas las queries relacionadas después de limpiar
      queryClient.invalidateQueries({ queryKey: [rqKeys.ALLOCATIONS] })
      queryClient.invalidateQueries({ queryKey: [rqKeys.SPOT] })
      queryClient.invalidateQueries({ queryKey: [rqKeys.APPLICANTS] })
      queryClient.invalidateQueries({ queryKey: [rqKeys.CAREERS] })
      setCurrentPhase(1)
      toast.success(
        "Se eliminaron todos los registros existentes, el proceso se reinició correctamente."
      )
    },
    onError: (error: any) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al reiniciar el proceso."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  return {
    stats,
    loadingStats,
    topCareers,
    loadingTopCareers,
    topApplicants,
    loadingTopApplicants,
    selectedPhase,
    handlePhaseSelector,
    clearAllTablesMutation
  }
}
