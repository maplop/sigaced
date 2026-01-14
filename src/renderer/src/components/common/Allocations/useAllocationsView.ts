import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllApplicants } from "@renderer/api/applicant"
import { getAllSpots } from "@renderer/api/spot"
import { useMemo, useState } from "react"
import { deleteAllAllocationsFromPhase, getAllocationsByPhase } from "@renderer/api/allocation"
import { AllocationRow } from "src/shared/types"
import { handleAllocate } from "@renderer/utils/allocations"
import { toast } from "sonner"
import { useAssignmentPhase } from "@renderer/context/AssignmentPhaseContext"
import { PhaseType } from "@renderer/utils/types"
import { exportPDF } from "@renderer/api/pdf"
import { getPhaseName } from "@renderer/utils/getPhaseName"

export const useAllocations = (phaseId: number) => {
  const { setCurrentPhase } = useAssignmentPhase()
  const queryClient = useQueryClient()

  const { data: allocations, isLoading: loadingAllocations } = useQuery({
    queryKey: [rqKeys.ALLOCATIONS, phaseId],
    queryFn: () => getAllocationsByPhase(phaseId)
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof AllocationRow | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [isAllocated, setIsAllocated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const [showAlert, setShowAlert] = useState(false)
  const [applicantsWithoutRequests, setApplicantsWithoutRequests] = useState<any[]>([])

  const filteredAndSortedAllocations = useMemo(() => {
    if (!allocations) return []

    // Filtrado
    const filtered = allocations.filter((allocation) =>
      `${allocation.name} ${allocation.lastName} ${allocation.ci} ${allocation.career} ${allocation.location}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )

    // Ordenamiento
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
      })
    }

    return filtered
  }, [allocations, searchTerm, sortField, sortDirection])

  // Paginación
  const paginatedAllocations: AllocationRow[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedAllocations.slice(startIndex, endIndex)
  }, [filteredAndSortedAllocations, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedAllocations?.length / itemsPerPage)
  }, [filteredAndSortedAllocations, itemsPerPage])

  const handleSort = (field: keyof AllocationRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const { data: applicants } = useQuery({
    queryKey: [rqKeys.APPLICANTS, phaseId],
    queryFn: () => getAllApplicants(phaseId)
  })

  const { data: spots } = useQuery({
    queryKey: [rqKeys.SPOT, phaseId],
    queryFn: () => getAllSpots(phaseId)
  })

  // Ordenar aspirantes por nota (grade) de mayor a menor
  const sortedApplicants = useMemo(() => {
    if (!applicants) return []
    return [...applicants].sort((a, b) => b.grade - a.grade)
  }, [applicants])

  const allocate = async () => {
    if (!sortedApplicants || !spots) return

    // 1️⃣ Validar que todos los aspirantes tengan al menos una request
    const missing = sortedApplicants.filter(
      (applicant) => !applicant.requests || applicant.requests.length === 0
    )

    if (missing.length > 0) {
      setApplicantsWithoutRequests(missing)
      setShowAlert(true) // 👈 activa el modal
      return
    }

    setIsAllocated(true)
    setError(null)
    setProgress(0)

    try {
      await handleAllocate(sortedApplicants, spots, phaseId + 1, (processed, total) => {
        setProgress(Math.round((processed / total) * 100))
      })
      await queryClient.invalidateQueries({ queryKey: [rqKeys.ALLOCATIONS, phaseId] })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error al otorgar plazas")
      toast.error(error, {
        style: {
          color: "var(--errorMessage)"
        }
      })
    } finally {
      setCurrentPhase((phaseId + 1) as PhaseType)
      setIsAllocated(false)
    }
  }

  const deleteAllMutation = useMutation({
    mutationFn: (phaseId: number) => deleteAllAllocationsFromPhase(phaseId),
    onSuccess: () => {
      const prevPhase = phaseId > 1 ? ((phaseId - 1) as PhaseType) : 1
      setCurrentPhase(prevPhase)
      toast.success("Todos los otorgamientos de la fase fueron eliminados.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.ALLOCATIONS, phaseId] })
    },
    onError: (err: any) => {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar otorgamientos"
      toast.error(errorMessage, { style: { color: "var(--errorMessage)" } })
    }
  })

  const handleDeleteAllFromPhase = () => {
    deleteAllMutation.mutate(phaseId)
  }

  const allocationsTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Ubicación", "Nota", "Preferencia"],
    ...filteredAndSortedAllocations.map((allocation, index) => [
      index + 1,
      allocation.ci,
      allocation.lastName,
      allocation.name,
      allocation.career,
      allocation.location,
      allocation.grade.toFixed(2),
      allocation.preferenceOrder
    ])
  ]

  const handleExportPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: `Listado del ${getPhaseName(phaseId)}`,
        table: allocationsTable,
        columnWidths: [20, 60, "auto", "auto", "auto", "auto", 40, 70],
        columnAlignments: ["center", "center", "left", "left", "left", "left", "center", "center"],
        saveName: `Listado del ${getPhaseName(phaseId)}.pdf`
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
    loadingAllocations,
    allocate,
    paginatedAllocations,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedAllocations,
    handleSort,
    progress,
    handleDeleteAllFromPhase,
    isAllocated,
    showAlert,
    setShowAlert,
    applicantsWithoutRequests,
    handleExportPDF
  }
}
