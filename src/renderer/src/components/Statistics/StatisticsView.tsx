import PageContainer from "../common/PageContainer"
import { PhaseIndicator } from "./PhaseIndicator"
import { KPICards } from "./KPICards"
import { TopStudents } from "./TopStudents"
import { TopCareers } from "./TopCareers"
import { useStatisticsVew } from "./useStatisticsVew"

const StatisticsView = () => {
  const {
    stats,
    loadingStats,
    topCareers,
    loadingTopCareers,
    topStudents,
    loadingTopStudents
  } = useStatisticsVew()

  console.log("stats --- ", stats)
  console.log("top careers --- ", topCareers)
  console.log("top students --- ", topStudents)


  return (
    <PageContainer>
      <div className="space-y-3">
        <PhaseIndicator />
        <KPICards stats={stats} loadingStats={loadingStats} />
        <div className="grid grid-cols-2 gap-4">
          <TopStudents topStudents={topStudents} loadingTopStudents={loadingTopStudents} />
          <TopCareers topCareers={topCareers} loadingTopCareers={loadingTopCareers} />
        </div>
      </div>
    </PageContainer>
  )
}
export default StatisticsView
