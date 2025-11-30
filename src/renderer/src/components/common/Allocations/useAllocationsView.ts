import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllStudents } from "@renderer/api/student"
import { getAllSpots } from "@renderer/api/spot"
import { useMemo, useState } from "react"
import { deleteAllAssignmentsFromPhase, getAssignmentsByPhase } from "@renderer/api/assignment"
import { AssignmentRow } from "src/shared/types"
import { handleAllocate } from "@renderer/utils/allocations"
import { toast } from "sonner"
import { useAssignmentPhase } from "@renderer/context/AssignmentPhaseContext"
import { PhaseType } from "@renderer/utils/types"

export const useAllocations = (phaseId: number) => {
  const { setCurrentPhase } = useAssignmentPhase()
  const queryClient = useQueryClient()

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: [rqKeys.ASSIGNMENTS, phaseId],
    queryFn: () => getAssignmentsByPhase(phaseId)
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof AssignmentRow | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [isAssigned, setIsAssigned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const [showAlert, setShowAlert] = useState(false)
  const [studentsWithoutRequests, setStudentsWithoutRequests] = useState<any[]>([])

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

  const { data: students } = useQuery({
    queryKey: [rqKeys.STUDENTS, phaseId],
    queryFn: () => getAllStudents(phaseId)
  })

  const { data: spots } = useQuery({
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

    // 1️⃣ Validar que todos los estudiantes tengan al menos una request
    const missing = sortedStudents.filter(
      (student) => !student.requests || student.requests.length === 0
    )

    if (missing.length > 0) {
      setStudentsWithoutRequests(missing)
      setShowAlert(true) // 👈 activa el modal
      return
    }

    setIsAssigned(true)
    setError(null)
    setProgress(0)

    try {
      await handleAllocate(sortedStudents, spots, phaseId + 1, (processed, total) => {
        setProgress(Math.round((processed / total) * 100))
      })
      await queryClient.invalidateQueries({ queryKey: [rqKeys.ASSIGNMENTS, phaseId] })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error al asignar plazas")
      toast.error(error, {
        style: {
          color: "var(--errorMessage)"
        }
      })
    } finally {
      setCurrentPhase((phaseId + 1) as PhaseType)
      setIsAssigned(false)
    }
  }

  const deleteAllMutation = useMutation({
    mutationFn: (phaseId: number) => deleteAllAssignmentsFromPhase(phaseId),
    onSuccess: () => {
      const prevPhase = phaseId > 1 ? ((phaseId - 1) as PhaseType) : 1
      setCurrentPhase(prevPhase)
      toast.success("Todas los otorgamientos de la fase fueron eliminadas.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.ASSIGNMENTS, phaseId] })
    },
    onError: (err: any) => {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar asignaciones"
      toast.error(errorMessage, { style: { color: "var(--errorMessage)" } })
    }
  })

  const handleDeleteAllFromPhase = () => {
    deleteAllMutation.mutate(phaseId)
  }

  return {
    loadingAssignments,
    allocate,
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
    progress,
    handleDeleteAllFromPhase,
    isAssigned,
    showAlert,
    setShowAlert,
    studentsWithoutRequests
  }
}
