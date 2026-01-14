import { ChartNoAxesColumnDecreasing, GraduationCap, Map, MapPin, School, Users } from "lucide-react"
import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { ReportCard } from "./ReportCard"
import { useReportsView } from "./useReportsView"

const ReportsView = () => {

  const {
    assignedStudentsBySpot,
    handleExportAssignedStudentsBySpotPDF,
    assignedStudentsByCareer,
    handleExportAssignedStudentsByCareerPDF,
    assignedStudentsByLocation,
    handleExportAssignedStudentsByLocationPDF,
    studentsByMunicipality,
    handleExportStudentsByMunicipalityPDF,
    careerClosing,
    handleExportCareerClosingPDF,
    studentsAndRequest,
    handleExportStudentsAndRequestPDF,
    isLoadingAssignedStudentsBySpot,
    isLoadingAssignedStudentsByCareer,
    isLoadingAssignedStudentsByLocation,
    isLoadingStudentsByMunicipality,
    isLoadingStudentsAndRequest
  } = useReportsView();


  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <PageTitle title="Centro de Reportes" subtitle="Accede a todos los reportes del sistema organizados por categoría. Los reportes se generan sobre los aspirantes a los cuales se les haya asignado una plaza. Selecciona el reporte que necesitas generar." />
        <div className="grid gap-8">
          {/* Sección Aspirantes */}
          <section>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              <ReportCard
                title="Aspirantes y Solicitudes"
                description="Listado aspirantes junto a las solicitudes que seleccionaron"
                icon={<Users className="h-5 w-5" />}
                handleGenerateReport={handleExportStudentsAndRequestPDF}
              />
              <ReportCard
                title="Aspirantes por Ubicación"
                description="Listado de aspirantes agrupados por ubicación"
                icon={<MapPin className="h-5 w-5" />}
                handleGenerateReport={handleExportAssignedStudentsByLocationPDF}
              />
              <ReportCard
                title="Aspirantes por Carrera"
                description="Listado de aspirantes agrupados por carrera"
                icon={<GraduationCap className="h-5 w-5" />}
                handleGenerateReport={handleExportAssignedStudentsByCareerPDF}
              />
              <ReportCard
                title="Aspirantes por Plaza"
                description="Listado de aspirantes agrupados por plaza"
                icon={<School className="h-5 w-5" />}
                handleGenerateReport={handleExportAssignedStudentsBySpotPDF}
              />
              <ReportCard
                title="Aspirantes por Municipios"
                description="Listado de aspirantes agrupados por municipios"
                icon={<Map className="h-5 w-5" />}
                handleGenerateReport={handleExportStudentsByMunicipalityPDF}
              />
              <ReportCard
                title="Nota de Corte"
                description="Nota mínima con la que se otorgó una carrera"
                icon={<ChartNoAxesColumnDecreasing className="h-5 w-5" />}
                handleGenerateReport={handleExportCareerClosingPDF}
              />
            </div>
          </section>
        </div>
      </div>

    </PageContainer>
  )
}
export default ReportsView