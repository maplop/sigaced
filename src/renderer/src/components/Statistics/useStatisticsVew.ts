import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getTopCareers, getTopStudents } from "@renderer/api/statistics"
import { rqKeys } from "@renderer/utils/rqKeys"

export const useStatisticsVew = () => {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: [rqKeys.ASSIGNMENTS, rqKeys.SPOT, rqKeys.STUDENTS],
    queryFn: getDashboardStats
  })

  const { data: topCareers, isLoading: loadingTopCareers } = useQuery({
    queryKey: [rqKeys.CAREERS, rqKeys.SPOT, rqKeys.STUDENTS],
    queryFn: getTopCareers
  })

  const { data: topStudents, isLoading: loadingTopStudents } = useQuery({
    queryKey: [rqKeys.STUDENTS, rqKeys.ASSIGNMENTS],
    queryFn: getTopStudents
  })

  return {
    stats,
    loadingStats,
    topCareers,
    loadingTopCareers,
    topStudents,
    loadingTopStudents
  }
}
