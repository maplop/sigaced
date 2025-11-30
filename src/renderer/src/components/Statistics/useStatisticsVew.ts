import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  clearAllTables,
  getDashboardStats,
  getTopCareers,
  getTopStudents
} from "@renderer/api/statistics"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useState } from "react"
import { toast } from "sonner"
import { useAssignmentPhase } from "@renderer/context/AssignmentPhaseContext"

export type PhaseSelectorType = "all" | 1 | 2 | 3

export const useStatisticsVew = () => {
  const queryClient = useQueryClient()

  const { setCurrentPhase } = useAssignmentPhase()

  const [selectedPhase, setSelectedPhase] = useState<PhaseSelectorType>("all")

  const phaseId = selectedPhase === "all" ? undefined : Number(selectedPhase)

  const handlePhaseSelector = (phase: PhaseSelectorType) => {
    setSelectedPhase(phase)
  }

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: [rqKeys.ASSIGNMENTS, rqKeys.SPOT, rqKeys.STUDENTS, phaseId],
    queryFn: () => getDashboardStats(phaseId)
  })

  const { data: topCareers, isLoading: loadingTopCareers } = useQuery({
    queryKey: [rqKeys.CAREERS, rqKeys.SPOT, rqKeys.STUDENTS, phaseId],
    queryFn: () => getTopCareers(phaseId)
  })

  const { data: topStudents, isLoading: loadingTopStudents } = useQuery({
    queryKey: [rqKeys.STUDENTS, rqKeys.ASSIGNMENTS, phaseId],
    queryFn: () => getTopStudents(phaseId)
  })

  // Mutation para limpiar todas las tablas
  const clearAllTablesMutation = useMutation({
    mutationFn: () => clearAllTables(),
    onSuccess: () => {
      // Refresca todas las queries relacionadas después de limpiar
      queryClient.invalidateQueries({ queryKey: [rqKeys.ASSIGNMENTS] })
      queryClient.invalidateQueries({ queryKey: [rqKeys.SPOT] })
      queryClient.invalidateQueries({ queryKey: [rqKeys.STUDENTS] })
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
    topStudents,
    loadingTopStudents,
    selectedPhase,
    handlePhaseSelector,
    clearAllTablesMutation
  }
}
