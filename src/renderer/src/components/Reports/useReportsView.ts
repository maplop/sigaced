import { exportPDF } from "@renderer/api/pdf"
import {
  getAssignedStudentsByCareer,
  getAssignedStudentsByLocation,
  getAssignedStudentsBySpot,
  getStudentsAndRequest,
  getStudentsByMunicipality
} from "@renderer/api/reports"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useReportsView = () => {
  const { data: assignedStudentsBySpot, isLoading: isLoadingAssignedStudentsBySpot } = useQuery({
    queryFn: () => getAssignedStudentsBySpot(),
    queryKey: [rqKeys.ASSIGNMENTS, rqKeys.STUDENTS, rqKeys.SPOT, rqKeys.CAREERS, rqKeys.LOCATIONS]
  })

  const assignedStudentsBySpotTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Localización", "Preferencia", "Nota"],
    ...(assignedStudentsBySpot?.map((assignedStudent, index) => [
      index + 1,
      assignedStudent.ci,
      assignedStudent.last_name,
      assignedStudent.name,
      assignedStudent.career,
      assignedStudent.location,
      assignedStudent.option_number,
      assignedStudent.grade?.toFixed(2) ?? "-"
    ]) ?? [])
  ]

  const handleExportAssignedStudentsBySpotPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Estudiantes por Plaza",
        table: assignedStudentsBySpotTable,
        columnWidths: [20, 50, "auto", "auto", "auto", "auto", 40, 30],
        columnAlignments: ["center", "left", "left", "left", "left", "left", "center", "center"],
        saveName: "Estudiantes por Plaza.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: assignedStudentsByCareer, isLoading: isLoadingAssignedStudentsByCareer } = useQuery(
    {
      queryFn: () => getAssignedStudentsByCareer(),
      queryKey: [rqKeys.ASSIGNMENTS, rqKeys.CAREERS, rqKeys.STUDENTS]
    }
  )

  const { data: assignedStudentsByLocation, isLoading: isLoadingAssignedStudentsByLocation } =
    useQuery({
      queryFn: () => getAssignedStudentsByLocation(),
      queryKey: [rqKeys.ASSIGNMENTS, rqKeys.LOCATIONS, rqKeys.STUDENTS]
    })

  const { data: studentsByMunicipality, isLoading: isLoadingStudentsByMunicipality } = useQuery({
    queryFn: () => getStudentsByMunicipality(),
    queryKey: [rqKeys.ASSIGNMENTS, rqKeys.STUDENTS]
  })

  const { data: studentsAndRequest, isLoading: isLoadingStudentsAndRequest } = useQuery({
    queryFn: () => getStudentsAndRequest(),
    queryKey: [rqKeys.STUDENTS, rqKeys.SPOT, rqKeys.CAREERS, rqKeys.LOCATIONS]
  })

  return {
    assignedStudentsBySpot,
    handleExportAssignedStudentsBySpotPDF,
    assignedStudentsByCareer,
    assignedStudentsByLocation,
    studentsByMunicipality,
    studentsAndRequest,
    isLoadingAssignedStudentsBySpot,
    isLoadingAssignedStudentsByCareer,
    isLoadingAssignedStudentsByLocation,
    isLoadingStudentsByMunicipality,
    isLoadingStudentsAndRequest
  }
}
