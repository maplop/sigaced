import { ChartNoAxesColumnDecreasing, GraduationCap, Map, MapPin, School, Users } from "lucide-react"
import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { ReportCard } from "./ReportCard"
import { useReportsView } from "./useReportsView"

const ReportsView = () => {

  const {
    assignedApplicantsBySpot,
    handleExportAssignedApplicantsBySpotPDF,
    assignedApplicantsByCareer,
    handleExportAssignedApplicantsByCareerPDF,
    assignedApplicantsByLocation,
    handleExportAssignedApplicantsByLocationPDF,
    applicantsByMunicipality,
    handleExportApplicantsByMunicipalityPDF,
    careerClosing,
    handleExportCareerClosingPDF,
    applicantsAndRequest,
    handleExportApplicantsAndRequestPDF,
    isLoadingAssignedApplicantsBySpot,
    isLoadingAssignedApplicantsByCareer,
    isLoadingAssignedApplicantsByLocation,
    isLoadingApplicantsByMunicipality,
    isLoadingApplicantsAndRequest,
    isLoadingCareerClosing
  } = useReportsView();


  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <PageTitle title="Centro de Reportes" subtitle="Herramienta de acceso a reportes que permite visualizar y analizar la información del sistema de manera estructurada." />
        <div className="grid gap-8">
          {/* Sección Aspirantes */}
          <section>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              <ReportCard
                title="Aspirantes y Solicitudes"
                description="Listado de todos los aspirantes con sus solicitudes en las diferentes fases"
                icon={<Users className="h-5 w-5" />}
                handleGenerateReport={handleExportApplicantsAndRequestPDF}
                isLoading={isLoadingApplicantsAndRequest}
                isDisabled={isLoadingApplicantsAndRequest || !applicantsAndRequest || applicantsAndRequest.length === 0}
              />
              <ReportCard
                title="Aspirantes por Ubicación"
                description="Listado de aspirantes con plazas otorgadas, agrupados por ubicación"
                icon={<MapPin className="h-5 w-5" />}
                handleGenerateReport={handleExportAssignedApplicantsByLocationPDF}
                isLoading={isLoadingAssignedApplicantsByLocation}
                isDisabled={isLoadingAssignedApplicantsByLocation || !assignedApplicantsByLocation || assignedApplicantsByLocation.length === 0}
              />
              <ReportCard
                title="Aspirantes por Carrera"
                description="Listado de aspirantes con plazas otorgadas, agrupados por carrera"
                icon={<GraduationCap className="h-5 w-5" />}
                handleGenerateReport={handleExportAssignedApplicantsByCareerPDF}
                isLoading={isLoadingAssignedApplicantsByCareer}
                isDisabled={isLoadingAssignedApplicantsByCareer || !assignedApplicantsByCareer || assignedApplicantsByCareer.length === 0}
              />
              <ReportCard
                title="Aspirantes por Plaza"
                description="Listado de aspirantes con plazas otorgadas, agrupados por plaza"
                icon={<School className="h-5 w-5" />}
                handleGenerateReport={handleExportAssignedApplicantsBySpotPDF}
                isLoading={isLoadingAssignedApplicantsBySpot}
                isDisabled={isLoadingAssignedApplicantsBySpot || !assignedApplicantsBySpot || assignedApplicantsBySpot.length === 0}
              />
              <ReportCard
                title="Aspirantes por Municipios"
                description="Listado de aspirantes con plazas otorgadas, agrupados por municipios"
                icon={<Map className="h-5 w-5" />}
                handleGenerateReport={handleExportApplicantsByMunicipalityPDF}
                isLoading={isLoadingApplicantsByMunicipality}
                isDisabled={isLoadingApplicantsByMunicipality || !applicantsByMunicipality || applicantsByMunicipality.length === 0}
              />
              <ReportCard
                title="Nota de Corte"
                description="Nota de corte por carrera basada en las plazas otorgadas"
                icon={<ChartNoAxesColumnDecreasing className="h-5 w-5" />}
                handleGenerateReport={handleExportCareerClosingPDF}
                isLoading={isLoadingCareerClosing}
                isDisabled={isLoadingCareerClosing || !careerClosing || careerClosing.length === 0}
              />
            </div>
          </section>
        </div>
      </div>

    </PageContainer>
  )
}
export default ReportsView