import {
  createAllocation,
  deleteAllAllocationsFromPhase,
  getAllocationsByPhase
} from "@renderer/api/allocation"
import { exportPDF } from "@renderer/api/pdf"
import { getAllSpots } from "@renderer/api/spot"
import { getAllApplicants } from "@renderer/api/applicant"
import { getPhaseName } from "@renderer/utils/getPhaseName"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AllocationRow } from "src/shared/types"
import { useAssignmentPhase } from "@renderer/context/AssignmentPhaseContext"

export const useManualAllocationView = (phaseId: number) => {
  const { setCurrentPhase } = useAssignmentPhase()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  const deleteAllMutation = useMutation({
    mutationFn: (phaseId: number) => deleteAllAllocationsFromPhase(phaseId),
    onSuccess: async () => {
      const inferred = await window.api.getInferredCurrentPhase()
      setCurrentPhase(inferred)
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

  const { data: applicants, isLoading: loadingApplicants } = useQuery({
    queryKey: [rqKeys.APPLICANTS],
    queryFn: () => getAllApplicants(phaseId)
  })

  const { data: spots, isLoading: loadingSpots } = useQuery({
    queryKey: [rqKeys.SPOT, phaseId],
    queryFn: () => getAllSpots(phaseId)
  })

  const [formData, setFormData] = useState<{
    applicantId: number | null
    spotId: number | null
  }>({
    applicantId: null,
    spotId: null
  })

  const unallocatedApplicants = useMemo(() => {
    if (!applicants || !allocations) return []

    // Paso 1: obtener IDs de aspirantes otorgados
    const allocatedIds = new Set(allocations.map((a) => a.applicantId))

    // Paso 2: filtrar aspirantes que NO están otorgados
    return applicants.filter((applicant) => !allocatedIds.has(applicant.id))
  }, [applicants, allocations])

  const allocatedCount = useMemo(() => {
    if (!allocations) return {}
    return allocations.reduce((acc: Record<number, number>, a) => {
      acc[a.spotId] = (acc[a.spotId] || 0) + 1
      return acc
    }, {})
  }, [allocations])

  const spotsWithAvailable = useMemo(() => {
    if (!spots) return []

    return spots.map((spot) => {
      const allocated = allocatedCount[spot.spotId] || 0
      const availableQuantityReal = Math.max(spot.availableQuantity - allocated, 0)
      return { ...spot, availableQuantityReal }
    })
  }, [spots, allocatedCount])

  const availableSpots = useMemo(() => {
    return spotsWithAvailable.filter((spot) => spot.availableQuantityReal > 0)
  }, [spotsWithAvailable])

  const manualAllocateMutation = useMutation({
    mutationFn: async ({ applicantId, spotId }: { applicantId: number; spotId: number }) => {
      await createAllocation({ applicantId, spotId })
    },
    onSuccess: () => {
      toast.success("Plaza otorgada al aspirante correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.ALLOCATIONS, phaseId] })
    },
    onError: (err: any) => {
      console.error(err)
      toast.error(err.message || "Error al otorgar plaza al aspirante.", {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!formData.applicantId || !formData.spotId) {
      toast.error("Debe seleccionar un aspirante y una plaza.", {
        style: { color: "var(--errorMessage)" }
      })
      return
    }

    manualAllocateMutation.mutate({
      applicantId: formData.applicantId,
      spotId: formData.spotId
    })

    resetForm()
  }

  const resetForm = () => {
    setFormData({ applicantId: null, spotId: null })
    setIsDialogOpen(false)
  }

  const manualAllocationsTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Ubicación", "Nota", "Preferencia"],
    ...filteredAndSortedAllocations.map((allocation, index) => [
      index + 1,
      allocation.ci,
      allocation.lastName,
      allocation.name,
      allocation.career,
      allocation.location,
      allocation.grade.toFixed(2),
      allocation.preferenceOrder ?? "-"
    ])
  ]

  const handleExportPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: `Listado del ${getPhaseName(phaseId)}`,
        table: manualAllocationsTable,
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
    isDialogOpen,
    setIsDialogOpen,
    paginatedAllocations,
    filteredAndSortedAllocations,
    loadingAllocations,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    sortField,
    handleSort,
    sortDirection,
    handleDeleteAllFromPhase,
    unallocatedApplicants,
    loadingApplicants,
    availableSpots,
    loadingSpots,
    formData,
    setFormData,
    handleSubmit,
    resetForm,
    handleExportPDF
  }
}
