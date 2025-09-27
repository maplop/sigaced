import { rqKeys } from "@renderer/utils/rqKeys"
import { useQuery } from "@tanstack/react-query"
import { getAllStudents } from "@renderer/api/student"
import { getAllSpots } from "@renderer/api/spot"
import { useMemo, useState } from "react"
import { getAllAssignments } from "@renderer/api/assignment"
import { AssignmentRow } from "src/shared/types"
import { handleAllocate } from "@renderer/utils/allocations"

export const useAllocations = (phaseId: number) => {
  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: [rqKeys.ASSIGNMENTS, phaseId],
    queryFn: () => getAllAssignments()
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof AssignmentRow | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

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

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: [rqKeys.STUDENTS, phaseId],
    queryFn: () => getAllStudents(phaseId)
  })

  const { data: spots, isLoading: loadingSpots } = useQuery({
    queryKey: [rqKeys.SPOT, phaseId],
    queryFn: () => getAllSpots(phaseId)
  })

  // Ordenar estudiantes por nota (grade) de mayor a menor
  const sortedStudents = useMemo(() => {
    if (!students) return []
    return [...students].sort((a, b) => b.grade - a.grade)
  }, [students])

  const allocate = async () => {
    if (!sortedStudents || !spots) return

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      await handleAllocate(sortedStudents, spots, phaseId + 1, (processed, total) => {
        setProgress(Math.round((processed / total) * 100))
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error al asignar plazas")
    } finally {
      setLoading(false)
    }
  }

  return {
    assignments,
    loadingAssignments,
    allocate,
    loadingStudents,
    loadingSpots,
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
    progress
  }
}
