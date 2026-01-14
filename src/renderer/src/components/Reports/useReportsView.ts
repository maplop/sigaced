import { exportPDF } from "@renderer/api/pdf"
import {
  getAssignedApplicantsByCareer,
  getAssignedApplicantsByLocation,
  getAssignedApplicantsBySpot,
  getCareerClosing,
  getApplicantsAndRequest,
  getApplicantsByMunicipality
} from "@renderer/api/reports"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useReportsView = () => {
  const { data: assignedApplicantsBySpot, isLoading: isLoadingAssignedApplicantsBySpot } = useQuery({
    queryFn: () => getAssignedApplicantsBySpot(),
    queryKey: [rqKeys.ALLOCATIONS, rqKeys.APPLICANTS, rqKeys.SPOT, rqKeys.CAREERS, rqKeys.LOCATIONS]
  })

  const assignedApplicantsBySpotTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Ubicación", "Preferencia", "Nota"],
    ...(assignedApplicantsBySpot?.map((assignedApplicant, index) => [
      index + 1,
      assignedApplicant.ci,
      assignedApplicant.lastName,
      assignedApplicant.name,
      assignedApplicant.career,
      assignedApplicant.location,
      assignedApplicant.preferenceOrder,
      assignedApplicant.grade?.toFixed(2) ?? "-"
    ]) ?? [])
  ]

  const handleExportAssignedApplicantsBySpotPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Aspirantes por Plaza",
        table: assignedApplicantsBySpotTable,
        columnWidths: [20, 50, "auto", "auto", "auto", "auto", 40, 30],
        columnAlignments: ["center", "left", "left", "left", "left", "left", "center", "center"],
        saveName: "Aspirantes por Plaza.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: assignedApplicantsByCareer, isLoading: isLoadingAssignedApplicantsByCareer } = useQuery(
    {
      queryFn: () => getAssignedApplicantsByCareer(),
      queryKey: [rqKeys.ALLOCATIONS, rqKeys.CAREERS, rqKeys.APPLICANTS]
    }
  )

  const assignedApplicantsByCareerTable = [
    ["#", "CI", "Apellidos", "Nombre", "Nota", "Sexo", "Municipio"],
    ...(assignedApplicantsByCareer?.map((assignedApplicant, index) => [
      index + 1,
      assignedApplicant.ci,
      assignedApplicant.lastName,
      assignedApplicant.name,
      assignedApplicant.grade?.toFixed(2) ?? "-",
      assignedApplicant.gender,
      assignedApplicant.municipality
    ]) ?? [])
  ]

  const handleExportAssignedApplicantsByCareerPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Aspirantes por Carrera",
        table: assignedApplicantsByCareerTable,
        columnWidths: [20, 70, "auto", "auto", 40, 30, "auto"],
        columnAlignments: ["center", "center", "left", "left", "center", "center", "left"],
        saveName: "Aspirantes por Carrera.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: assignedApplicantsByLocation, isLoading: isLoadingAssignedApplicantsByLocation } =
    useQuery({
      queryFn: () => getAssignedApplicantsByLocation(),
      queryKey: [rqKeys.ASSIGNMENTS, rqKeys.LOCATIONS, rqKeys.APPLICANTS]
    })

  const assignedApplicantsByLocationTable = [
    ["#", "CI", "Apellidos", "Nombre", "Nota", "Sexo", "Municipio"],
    ...(assignedApplicantsByLocation?.map((assignedApplicant, index) => [
      index + 1,
      assignedApplicant.ci,
      assignedApplicant.lastName,
      assignedApplicant.name,
      assignedApplicant.grade?.toFixed(2) ?? "-",
      assignedApplicant.gender,
      assignedApplicant.municipality
    ]) ?? [])
  ]

  const handleExportAssignedApplicantsByLocationPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Aspirantes por Ubicación",
        table: assignedApplicantsByLocationTable,
        columnWidths: [20, 70, "auto", "auto", 40, 30, "auto"],
        columnAlignments: ["center", "center", "left", "left", "center", "center", "left"],
        saveName: "Aspirantes por Ubicación.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: applicantsByMunicipality, isLoading: isLoadingApplicantsByMunicipality } = useQuery({
    queryFn: () => getApplicantsByMunicipality(),
    queryKey: [rqKeys.ALLOCATIONS, rqKeys.APPLICANTS]
  })

  const assignedApplicantsByMunicipalityTable = [
    ["#", "CI", "Apellidos", "Nombre", "Nota", "Sexo", "Municipio"],
    ...(applicantsByMunicipality?.map((assignedApplicant, index) => [
      index + 1,
      assignedApplicant.ci,
      assignedApplicant.lastName,
      assignedApplicant.name,
      assignedApplicant.grade?.toFixed(2) ?? "-",
      assignedApplicant.gender,
      assignedApplicant.municipality
    ]) ?? [])
  ]

  const handleExportApplicantsByMunicipalityPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Aspirantes por Municipio",
        table: assignedApplicantsByMunicipalityTable,
        columnWidths: [20, 70, "auto", "auto", 40, 30, "auto"],
        columnAlignments: ["center", "center", "left", "left", "center", "center", "left"],
        saveName: "Aspirantes por Municipio.pdf"
      })
      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message, {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: applicantsAndRequest, isLoading: isLoadingApplicantsAndRequest } = useQuery({
    queryFn: () => getApplicantsAndRequest(),
    queryKey: [rqKeys.APPLICANTS, rqKeys.SPOT, rqKeys.CAREERS, rqKeys.LOCATIONS]
  })

  const applicantsAndRequestTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Ubicación", "Preferencia", "Fase", "Nota"],
    ...(applicantsAndRequest?.map((applicantAndRequest, index) => [
      index + 1,
      applicantAndRequest.ci,
      applicantAndRequest.lastName,
      applicantAndRequest.name,
      applicantAndRequest.career,
      applicantAndRequest.location,
      applicantAndRequest.preferenceOrder,
      applicantAndRequest.phase,
      applicantAndRequest.grade?.toFixed(2) ?? "-"
    ]) ?? [])
  ]

  const handleExportApplicantsAndRequestPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Aspirantes y Solicitudes",
        table: applicantsAndRequestTable,
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
        saveName: "Aspirantes y Solicitudes.pdf"
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
    queryKey: [rqKeys.CAREERS, rqKeys.SPOT, rqKeys.ALLOCATIONS, rqKeys.APPLICANTS]
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
    assignedApplicantsBySpot,
    handleExportAssignedApplicantsBySpotPDF,
    assignedApplicantsByCareer,
    handleExportAssignedApplicantsByCareerPDF,
    assignedApplicantsByLocation,
    handleExportAssignedApplicantsByLocationPDF,
    applicantsByMunicipality,
    handleExportApplicantsByMunicipalityPDF,
    applicantsAndRequest,
    handleExportApplicantsAndRequestPDF,
    careerClosing,
    handleExportCareerClosingPDF,
    isLoadingAssignedApplicantsBySpot,
    isLoadingAssignedApplicantsByCareer,
    isLoadingAssignedApplicantsByLocation,
    isLoadingApplicantsByMunicipality,
    isLoadingApplicantsAndRequest
  }
}
