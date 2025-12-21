import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { deleteAllAssignments, getAllAssignments } from "@renderer/api/assignment"
import { AssignmentRow } from "src/shared/types"
import { toast } from "sonner"
import { exportPDF } from "@renderer/api/pdf"
import { getPhaseName } from "@renderer/utils/getPhaseName"

export const useFinalList = () => {
  const queryClient = useQueryClient()

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: [rqKeys.ASSIGNMENTS],
    queryFn: () => getAllAssignments()
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof AssignmentRow | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredAndSortedAssignments = useMemo(() => {
    if (!assignments) return []

    // Filtrado
    const filtered = assignments.filter((assignment) =>
      `${assignment.name} ${assignment.lastName} ${assignment.ci} ${assignment.career} ${assignment.location}`
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
  }, [assignments, searchTerm, sortField, sortDirection])

  // Paginación
  const paginatedAssignments: AssignmentRow[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedAssignments.slice(startIndex, endIndex)
  }, [filteredAndSortedAssignments, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedAssignments?.length / itemsPerPage)
  }, [filteredAndSortedAssignments, itemsPerPage])

  const handleSort = (field: keyof AssignmentRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const deleteAllMutation = useMutation({
    mutationFn: () => deleteAllAssignments(),
    onSuccess: () => {
      toast.success("Todas los otorgamientos de la fase fueron eliminadas.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.ASSIGNMENTS] })
    },
    onError: (err: any) => {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar asignaciones"
      toast.error(errorMessage, { style: { color: "var(--errorMessage)" } })
    }
  })

  const handleDeleteAllFromPhase = () => {
    deleteAllMutation.mutate()
  }

  const finalAllocationsTable = [
    ["#", "CI", "Apellidos", "Nombre", "Carrera", "Localización", "Nota", "Fase", "Preferencia"],
    ...filteredAndSortedAssignments.map((allocation, index) => [
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
    loadingAssignments,
    paginatedAssignments,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedAssignments,
    handleSort,
    handleDeleteAllFromPhase,
    handleExportPDF
  }
}
