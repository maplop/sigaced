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
  const { data: assignedApplicantsBySpot, isLoading: isLoadingAssignedApplicantsBySpot } = useQuery(
    {
      queryFn: () => getAssignedApplicantsBySpot(),
      queryKey: [
        rqKeys.ALLOCATIONS,
        rqKeys.APPLICANTS,
        rqKeys.SPOT,
        rqKeys.CAREERS,
        rqKeys.LOCATIONS
      ]
    }
  )

  const handleExportAssignedApplicantsBySpotPDF = async () => {
    try {
      if (!assignedApplicantsBySpot || assignedApplicantsBySpot.length === 0) {
        toast.error("No hay aspirantes asignados para exportar")
        return
      }

      // Agrupar aspirantes por carrera + ubicación (spot)
      const applicantsBySpot = assignedApplicantsBySpot.reduce(
        (acc, applicant) => {
          const career = applicant.career || "Sin carrera"
          const location = applicant.location || "Sin ubicación"
          const spotKey = `${career} - ${location}`

          if (!acc[spotKey]) {
            acc[spotKey] = []
          }
          acc[spotKey].push(applicant)
          return acc
        },
        {} as Record<string, typeof assignedApplicantsBySpot>
      )

      // Permitir al usuario seleccionar la carpeta de destino
      const folderResponse = await window.api.selectFolder()
      if (!folderResponse.success || folderResponse.canceled || !folderResponse.path) {
        if (folderResponse.canceled) {
          toast.info("Operación cancelada")
          return
        }
        throw new Error(folderResponse.error || "No se seleccionó ninguna carpeta")
      }

      // Crear subcarpeta "Aspirantes por Plaza" dentro de la carpeta seleccionada
      const pathSeparator = folderResponse.path.includes("\\") ? "\\" : "/"
      const outputDir = `${folderResponse.path}${pathSeparator}Aspirantes por plazas`

      // Generar un PDF por cada spot (carrera + ubicación)
      const spots = Object.keys(applicantsBySpot).sort()

      for (const spotKey of spots) {
        const applicants = applicantsBySpot[spotKey]

        // Crear tabla para este spot
        const spotTable = [
          ["#", "CI", "Apellidos", "Nombre", "Sexo", "Municipio", "Nota", "Fase", "Preferencia"],
          ...applicants.map((applicant, index) => [
            index + 1,
            applicant.ci,
            applicant.lastName,
            applicant.name,
            applicant.gender,
            applicant.municipality,
            applicant.grade?.toFixed(2) ?? "-",
            applicant.phase,
            applicant.preferenceOrder
          ])
        ]

        // Generar nombre de archivo seguro (sin caracteres especiales)
        const safeSpotName = spotKey.replace(/[<>:"/\\|?*]/g, "_")

        await exportPDF({
          subtitle: spotKey,
          table: spotTable,
          columnWidths: [20, 50, "auto", "auto", 30, "auto", 40, 30, 50],
          columnAlignments: [
            "center",
            "center",
            "left",
            "left",
            "center",
            "left",
            "center",
            "center",
            "center"
          ],
          saveName: `${safeSpotName}.pdf`,
          outputDir: outputDir
        })
      }

      toast.success(`${spots.length} PDFs generados en: ${outputDir}`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al generar los PDFs", {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: assignedApplicantsByCareer, isLoading: isLoadingAssignedApplicantsByCareer } =
    useQuery({
      queryFn: () => getAssignedApplicantsByCareer(),
      queryKey: [rqKeys.ALLOCATIONS, rqKeys.APPLICANTS, rqKeys.SPOT, rqKeys.CAREERS]
    })

  const handleExportAssignedApplicantsByCareerPDF = async () => {
    try {
      if (!assignedApplicantsByCareer || assignedApplicantsByCareer.length === 0) {
        toast.error("No hay aspirantes asignados para exportar")
        return
      }

      // Agrupar aspirantes por carrera
      const applicantsByCareer = assignedApplicantsByCareer.reduce(
        (acc, applicant) => {
          const career = applicant.career || "Sin carrera"
          if (!acc[career]) {
            acc[career] = []
          }
          acc[career].push(applicant)
          return acc
        },
        {} as Record<string, typeof assignedApplicantsByCareer>
      )

      // Permitir al usuario seleccionar la carpeta de destino
      const folderResponse = await window.api.selectFolder()
      if (!folderResponse.success || folderResponse.canceled || !folderResponse.path) {
        if (folderResponse.canceled) {
          toast.info("Operación cancelada")
          return
        }
        throw new Error(folderResponse.error || "No se seleccionó ninguna carpeta")
      }

      // Crear subcarpeta "Aspirantes por carrera" dentro de la carpeta seleccionada
      const pathSeparator = folderResponse.path.includes("\\") ? "\\" : "/"
      const outputDir = `${folderResponse.path}${pathSeparator}Aspirantes por carreras`

      // Generar un PDF por cada carrera
      const careers = Object.keys(applicantsByCareer).sort()

      for (const career of careers) {
        const applicants = applicantsByCareer[career]

        // Crear tabla para esta carrera
        const careerTable = [
          [
            "#",
            "CI",
            "Apellidos",
            "Nombre",
            "Sexo",
            "Municipio",
            "Nota",
            "Ubicación",
            "Fase",
            "Preferencia"
          ],
          ...applicants.map((applicant, index) => [
            index + 1,
            applicant.ci,
            applicant.lastName,
            applicant.name,
            applicant.gender,
            applicant.municipality,
            applicant.grade?.toFixed(2) ?? "-",
            applicant.location,
            applicant.phase,
            applicant.preferenceOrder
          ])
        ]

        // Generar nombre de archivo seguro (sin caracteres especiales)
        const safeCareerName = career.replace(/[<>:"/\\|?*]/g, "_")

        await exportPDF({
          subtitle: career,
          table: careerTable,
          columnWidths: [20, 50, "auto", "auto", 30, "auto", 30, "auto", 40, 50],
          columnAlignments: [
            "center",
            "center",
            "left",
            "left",
            "center",
            "left",
            "center",
            "left",
            "center",
            "center"
          ],
          saveName: `${safeCareerName}.pdf`,
          outputDir: outputDir
        })
      }

      toast.success(`${careers.length} PDFs generados en: ${outputDir}`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al generar los PDFs", {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: assignedApplicantsByLocation, isLoading: isLoadingAssignedApplicantsByLocation } =
    useQuery({
      queryFn: () => getAssignedApplicantsByLocation(),
      queryKey: [rqKeys.ALLOCATIONS, rqKeys.APPLICANTS, rqKeys.SPOT, rqKeys.LOCATIONS]
    })

  const handleExportAssignedApplicantsByLocationPDF = async () => {
    try {
      if (!assignedApplicantsByLocation || assignedApplicantsByLocation.length === 0) {
        toast.error("No hay aspirantes asignados para exportar")
        return
      }

      // Agrupar aspirantes por ubicación
      const applicantsByLocation = assignedApplicantsByLocation.reduce(
        (acc, applicant) => {
          const location = applicant.location || "Sin ubicación"
          if (!acc[location]) {
            acc[location] = []
          }
          acc[location].push(applicant)
          return acc
        },
        {} as Record<string, typeof assignedApplicantsByLocation>
      )

      // Permitir al usuario seleccionar la carpeta de destino
      const folderResponse = await window.api.selectFolder()
      if (!folderResponse.success || folderResponse.canceled || !folderResponse.path) {
        if (folderResponse.canceled) {
          toast.info("Operación cancelada")
          return
        }
        throw new Error(folderResponse.error || "No se seleccionó ninguna carpeta")
      }

      // Crear subcarpeta "Aspirantes por ubicación" dentro de la carpeta seleccionada
      const pathSeparator = folderResponse.path.includes("\\") ? "\\" : "/"
      const outputDir = `${folderResponse.path}${pathSeparator}Aspirantes por ubicación`

      // Generar un PDF por cada ubicación
      const locations = Object.keys(applicantsByLocation).sort()

      for (const location of locations) {
        const applicants = applicantsByLocation[location]

        // Crear tabla para esta ubicación
        const locationTable = [
          [
            "#",
            "CI",
            "Apellidos",
            "Nombre",
            "Sexo",
            "Municipio",
            "Nota",
            "Carrera",
            "Fase",
            "Preferencia"
          ],
          ...applicants.map((applicant, index) => [
            index + 1,
            applicant.ci,
            applicant.lastName,
            applicant.name,
            applicant.gender,
            applicant.municipality,
            applicant.grade?.toFixed(2) ?? "-",
            applicant.career,
            applicant.phase,
            applicant.preferenceOrder
          ])
        ]

        // Generar nombre de archivo seguro (sin caracteres especiales)
        const safeLocationName = location.replace(/[<>:"/\\|?*]/g, "_")

        await exportPDF({
          subtitle: location,
          table: locationTable,
          columnWidths: [20, 50, "auto", "auto", 30, "auto", 40, "auto", 30, 50],
          columnAlignments: [
            "center",
            "center",
            "left",
            "left",
            "center",
            "left",
            "center",
            "left",
            "center",
            "center"
          ],
          saveName: `${safeLocationName}.pdf`,
          outputDir: outputDir
        })
      }

      toast.success(`${locations.length} PDFs generados en: ${outputDir}`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al generar los PDFs", {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: applicantsByMunicipality, isLoading: isLoadingApplicantsByMunicipality } = useQuery(
    {
      queryFn: () => getApplicantsByMunicipality(),
      queryKey: [rqKeys.ALLOCATIONS, rqKeys.APPLICANTS, rqKeys.SPOT]
    }
  )

  const handleExportApplicantsByMunicipalityPDF = async () => {
    try {
      if (!applicantsByMunicipality || applicantsByMunicipality.length === 0) {
        toast.error("No hay aspirantes asignados para exportar")
        return
      }

      // Agrupar aspirantes por municipio
      const applicantsByMunicipalityGrouped = applicantsByMunicipality.reduce(
        (acc, applicant) => {
          const municipality = applicant.municipality || "Sin municipio"
          if (!acc[municipality]) {
            acc[municipality] = []
          }
          acc[municipality].push(applicant)
          return acc
        },
        {} as Record<string, typeof applicantsByMunicipality>
      )

      // Permitir al usuario seleccionar la carpeta de destino
      const folderResponse = await window.api.selectFolder()
      if (!folderResponse.success || folderResponse.canceled || !folderResponse.path) {
        if (folderResponse.canceled) {
          toast.info("Operación cancelada")
          return
        }
        throw new Error(folderResponse.error || "No se seleccionó ninguna carpeta")
      }

      // Crear subcarpeta "Aspirantes por municipio" dentro de la carpeta seleccionada
      const pathSeparator = folderResponse.path.includes("\\") ? "\\" : "/"
      const outputDir = `${folderResponse.path}${pathSeparator}Aspirantes por municipio`

      // Generar un PDF por cada municipio
      const municipalities = Object.keys(applicantsByMunicipalityGrouped).sort()

      for (const municipality of municipalities) {
        const applicants = applicantsByMunicipalityGrouped[municipality]

        // Crear tabla para este municipio
        const municipalityTable = [
          [
            "#",
            "CI",
            "Apellidos",
            "Nombre",
            "Sexo",
            "Nota",
            "Carrera",
            "Ubicación",
            "Fase",
            "Preferencia"
          ],
          ...applicants.map((applicant, index) => [
            index + 1,
            applicant.ci,
            applicant.lastName,
            applicant.name,
            applicant.gender,
            applicant.grade?.toFixed(2) ?? "-",
            applicant.career,
            applicant.location,
            applicant.phase,
            applicant.preferenceOrder
          ])
        ]

        // Generar nombre de archivo seguro (sin caracteres especiales)
        const safeMunicipalityName = municipality.replace(/[<>:"/\\|?*]/g, "_")

        await exportPDF({
          subtitle: municipality,
          table: municipalityTable,
          columnWidths: [20, 50, "auto", "auto", 30, 30, "auto", "auto", 30, 50],
          columnAlignments: [
            "center",
            "center",
            "left",
            "left",
            "center",
            "center",
            "left",
            "left",
            "center",
            "center"
          ],
          saveName: `${safeMunicipalityName}.pdf`,
          outputDir: outputDir
        })
      }

      toast.success(`${municipalities.length} PDFs generados en: ${outputDir}`)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al generar los PDFs", {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: applicantsAndRequest, isLoading: isLoadingApplicantsAndRequest } = useQuery({
    queryFn: () => getApplicantsAndRequest(),
    queryKey: [rqKeys.APPLICANTS, rqKeys.SPOT, rqKeys.CAREERS, rqKeys.LOCATIONS]
  })

  const handleExportApplicantsAndRequestPDF = async () => {
    try {
      if (!applicantsAndRequest || applicantsAndRequest.length === 0) {
        toast.error("No hay aspirantes con solicitudes para exportar")
        return
      }

      // Permitir al usuario seleccionar la carpeta de destino
      const folderResponse = await window.api.selectFolder()
      if (!folderResponse.success || folderResponse.canceled || !folderResponse.path) {
        if (folderResponse.canceled) {
          toast.info("Operación cancelada")
          return
        }
        throw new Error(folderResponse.error || "No se seleccionó ninguna carpeta")
      }

      // Crear tabla única con todos los registros (cada fila es una solicitud)
      const applicantsAndRequestTable = [
        ["#", "CI", "Apellidos", "Nombre", "Carrera", "Ubicación", "Fase", "Preferencia", "Nota"],
        ...applicantsAndRequest.map((applicant, index) => [
          index + 1,
          applicant.ci,
          applicant.lastName,
          applicant.name,
          applicant.career,
          applicant.location,
          applicant.phase,
          applicant.preferenceOrder,
          applicant.grade?.toFixed(2) ?? "-"
        ])
      ]

      // Generar un solo PDF con todas las solicitudes
      const path = await exportPDF({
        subtitle: "Aspirantes y Solicitudes",
        table: applicantsAndRequestTable,
        columnWidths: [20, 50, "auto", "auto", "auto", "auto", 30, 40, 30],
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
        saveName: "Aspirantes y Solicitudes.pdf",
        outputDir: folderResponse.path
      })

      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al generar el PDF", {
        style: { color: "var(--errorMessage)" }
      })
    }
  }

  const { data: careerClosing, isLoading: isLoadingCareerClosing } = useQuery({
    queryFn: () => getCareerClosing(),
    queryKey: [rqKeys.CAREERS, rqKeys.SPOT, rqKeys.ALLOCATIONS, rqKeys.APPLICANTS]
  })

  const handleExportCareerClosingPDF = async () => {
    try {
      if (!careerClosing || careerClosing.length === 0) {
        toast.error("No hay datos de nota de corte para exportar")
        return
      }

      // Permitir al usuario seleccionar la carpeta de destino
      const folderResponse = await window.api.selectFolder()
      if (!folderResponse.success || folderResponse.canceled || !folderResponse.path) {
        if (folderResponse.canceled) {
          toast.info("Operación cancelada")
          return
        }
        throw new Error(folderResponse.error || "No se seleccionó ninguna carpeta")
      }

      // Generar un PDF con todas las carreras
      const careerClosingTable = [
        ["#", "Carrera", "Nota de Corte"],
        ...careerClosing.map((career, index) => [
          index + 1,
          career.name,
          career.closing_grade?.toFixed(2) ?? "-"
        ])
      ]

      const path = await exportPDF({
        subtitle: "Nota de Corte por Carreras",
        table: careerClosingTable,
        columnWidths: [20, "auto", 60],
        columnAlignments: ["center", "left", "center"],
        saveName: "Nota de Corte por Carreras.pdf",
        outputDir: folderResponse.path
      })

      toast.success("Reporte descargado en: " + path)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al generar el PDF", {
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
    isLoadingApplicantsAndRequest,
    isLoadingCareerClosing
  }
}
