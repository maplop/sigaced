import { exportPDF } from "@renderer/api/pdf"
import {
  getAssignedStudentsByCareer,
  getAssignedStudentsByLocation,
  getAssignedStudentsBySpot,
  getCareerClosing,
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
      assignedStudent.lastName,
      assignedStudent.name,
      assignedStudent.career,
      assignedStudent.location,
      assignedStudent.preferenceOrder,
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

  const assignedStudentsByCareerTable = [
    ["#", "CI", "Apellidos", "Nombre", "Nota", "Sexo", "Municipio"],
    ...(assignedStudentsByCareer?.map((assignedStudent, index) => [
      index + 1,
      assignedStudent.ci,
      assignedStudent.lastName,
      assignedStudent.name,
      assignedStudent.grade?.toFixed(2) ?? "-",
      assignedStudent.gender,
      assignedStudent.municipality
    ]) ?? [])
  ]

  const handleExportAssignedStudentsByCareerPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Estudiantes por Carrera",
        table: assignedStudentsByCareerTable,
        columnWidths: [20, 70, "auto", "auto", 40, 30, "auto"],
        columnAlignments: ["center", "center", "left", "left", "center", "center", "left"],
        saveName: "Estudiantes por Carrera.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: assignedStudentsByLocation, isLoading: isLoadingAssignedStudentsByLocation } =
    useQuery({
      queryFn: () => getAssignedStudentsByLocation(),
      queryKey: [rqKeys.ASSIGNMENTS, rqKeys.LOCATIONS, rqKeys.STUDENTS]
    })

  const assignedStudentsByLocationTable = [
    ["#", "CI", "Apellidos", "Nombre", "Nota", "Sexo", "Municipio"],
    ...(assignedStudentsByLocation?.map((assignedStudent, index) => [
      index + 1,
      assignedStudent.ci,
      assignedStudent.lastName,
      assignedStudent.name,
      assignedStudent.grade?.toFixed(2) ?? "-",
      assignedStudent.gender,
      assignedStudent.municipality
    ]) ?? [])
  ]

  const handleExportAssignedStudentsByLocationPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Estudiantes por Carrera",
        table: assignedStudentsByLocationTable,
        columnWidths: [20, 70, "auto", "auto", 40, 30, "auto"],
        columnAlignments: ["center", "center", "left", "left", "center", "center", "left"],
        saveName: "Estudiantes por Localización.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: studentsByMunicipality, isLoading: isLoadingStudentsByMunicipality } = useQuery({
    queryFn: () => getStudentsByMunicipality(),
    queryKey: [rqKeys.ASSIGNMENTS, rqKeys.STUDENTS]
  })

  const assignedStudentsByMunicipalityTable = [
    ["#", "CI", "Apellidos", "Nombre", "Nota", "Sexo", "Municipio"],
    ...(studentsByMunicipality?.map((assignedStudent, index) => [
      index + 1,
      assignedStudent.ci,
      assignedStudent.lastName,
      assignedStudent.name,
      assignedStudent.grade?.toFixed(2) ?? "-",
      assignedStudent.gender,
      assignedStudent.municipality
    ]) ?? [])
  ]

  const handleExportStudentsByMunicipalityPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Estudiantes por Carrera",
        table: assignedStudentsByMunicipalityTable,
        columnWidths: [20, 70, "auto", "auto", 40, 30, "auto"],
        columnAlignments: ["center", "center", "left", "left", "center", "center", "left"],
        saveName: "Estudiantes por Municipio.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: studentsAndRequest, isLoading: isLoadingStudentsAndRequest } = useQuery({
    queryFn: () => getStudentsAndRequest(),
    queryKey: [rqKeys.STUDENTS, rqKeys.SPOT, rqKeys.CAREERS, rqKeys.LOCATIONS]
  })

  const studentsAndRequestTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Localización", "Preferencia", "Fase", "Nota"],
    ...(studentsAndRequest?.map((studentAndRequest, index) => [
      index + 1,
      studentAndRequest.ci,
      studentAndRequest.lastName,
      studentAndRequest.name,
      studentAndRequest.career,
      studentAndRequest.location,
      studentAndRequest.preferenceOrder,
      studentAndRequest.phase,
      studentAndRequest.grade?.toFixed(2) ?? "-"
    ]) ?? [])
  ]

  const handleExportStudentsAndRequestPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Estudiantes y Solicitudes",
        table: studentsAndRequestTable,
        columnWidths: [20, 50, "auto", "auto", "auto", "auto", 40, 30, 30],
        columnAlignments: [
          "center",
          "center",
          "left",
          "left",
          "left",
          "left",
          "center",
          "center",
          "center"
        ],
        saveName: "Estudiantes y Solicitudes.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: careerClosing, isLoading: isLoadingCareerClosing } = useQuery({
    queryFn: () => getCareerClosing(),
    queryKey: [rqKeys.CAREERS, rqKeys.SPOT, rqKeys.ASSIGNMENTS, rqKeys.STUDENTS]
  })

  const careerClosingTable = [
    ["#", "Carrera", "Nota de Corte"],
    ...(careerClosing?.map((careerClosing, index) => [
      index + 1,
      careerClosing.name,
      careerClosing.closing_grade?.toFixed(2) ?? "-"
    ]) ?? [])
  ]

  const handleExportCareerClosingPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Nota de Corte por Carreras",
        table: careerClosingTable,
        columnWidths: [20, "auto", 60],
        columnAlignments: ["center", "left", "center"],
        saveName: "Nota de Corte por Carreras.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  return {
    assignedStudentsBySpot,
    handleExportAssignedStudentsBySpotPDF,
    assignedStudentsByCareer,
    handleExportAssignedStudentsByCareerPDF,
    assignedStudentsByLocation,
    handleExportAssignedStudentsByLocationPDF,
    studentsByMunicipality,
    handleExportStudentsByMunicipalityPDF,
    studentsAndRequest,
    handleExportStudentsAndRequestPDF,
    careerClosing,
    handleExportCareerClosingPDF,
    isLoadingAssignedStudentsBySpot,
    isLoadingAssignedStudentsByCareer,
    isLoadingAssignedStudentsByLocation,
    isLoadingStudentsByMunicipality,
    isLoadingStudentsAndRequest
  }
}
