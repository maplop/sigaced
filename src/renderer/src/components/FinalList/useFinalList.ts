import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { deleteAllAssignments, getAllAssignments } from "@renderer/api/assignment"
import { AssignmentRow } from "src/shared/types"
import { toast } from "sonner"

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
    handleDeleteAllFromPhase
  }
}
