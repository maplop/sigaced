import PageContainer from "../common/PageContainer"
import { PhaseIndicator } from "./PhaseIndicator"
import { KPICards } from "./KPICards"
import { TopStudents } from "./TopStudents"
import { TopCareers } from "./TopCareers"
import { PhaseSelector } from "./PhaseSelector"
import { useStatisticsVew } from "./useStatisticsVew"

const StatisticsView = () => {
  const {
    stats,
    loadingStats,
    topCareers,
    loadingTopCareers,
    topStudents,
    loadingTopStudents,
    selectedPhase,
    handlePhaseSelector
  } = useStatisticsVew()

  return (
    <PageContainer>
      <div className="space-y-6">
        <PhaseIndicator />
        <div className="space-y-3">
          <PhaseSelector selectedPhase={selectedPhase} handlePhaseSelector={handlePhaseSelector} />
          <KPICards stats={stats} loadingStats={loadingStats} />
          <div className="grid grid-cols-2 gap-4">
            <TopStudents topStudents={topStudents} loadingTopStudents={loadingTopStudents} />
            <TopCareers topCareers={topCareers} loadingTopCareers={loadingTopCareers} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
export default StatisticsView
