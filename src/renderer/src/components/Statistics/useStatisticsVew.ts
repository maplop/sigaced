import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getTopCareers, getTopStudents } from "@renderer/api/statistics"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useState } from "react"

export type PhaseSelectorType = "all" | 1 | 2 | 3

export const useStatisticsVew = () => {
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

  return {
    stats,
    loadingStats,
    topCareers,
    loadingTopCareers,
    topStudents,
    loadingTopStudents,
    selectedPhase,
    handlePhaseSelector
  }
}
