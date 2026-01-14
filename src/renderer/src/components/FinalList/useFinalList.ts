import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { deleteAllAllocations, getAllAllocations } from "@renderer/api/allocation"
import { AllocationRow } from "src/shared/types"
import { toast } from "sonner"
import { exportPDF } from "@renderer/api/pdf"

export const useFinalList = () => {
  const queryClient = useQueryClient()

  const { data: allocations, isLoading: loadingAllocations } = useQuery({
    queryKey: [rqKeys.ALLOCATIONS],
    queryFn: () => getAllAllocations()
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
    mutationFn: () => deleteAllAllocations(),
    onSuccess: () => {
      toast.success("Todos los otorgamientos fueron eliminados.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.ALLOCATIONS] })
    },
    onError: (err: any) => {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar otorgamientos"
      toast.error(errorMessage, { style: { color: "var(--errorMessage)" } })
    }
  })

  const handleDeleteAllFromPhase = () => {
    deleteAllMutation.mutate()
  }

  const finalAllocationsTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Ubicación", "Nota", "Fase", "Preferencia"],
    ...filteredAndSortedAllocations.map((allocation, index) => [
      index + 1,
      allocation.ci,
      allocation.lastName,
      allocation.name,
      allocation.career,
      allocation.location,
      allocation.grade.toFixed(2),
      allocation.phase,
      allocation.preferenceOrder ?? "-"
    ])
  ]

  const handleExportPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: "Listado Final del Otorgamiento",
        table: finalAllocationsTable,
        columnWidths: [20, 50, "auto", "auto", 50, "auto", 40, 30, 60],
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
        saveName: "Listado Final del Otorgamiento.pdf"
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
    handleDeleteAllFromPhase,
    handleExportPDF
  }
}
