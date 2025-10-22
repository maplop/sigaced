import {
  createAssignment,
  deleteAllAssignmentsFromPhase,
  getAssignmentsByPhase
} from "@renderer/api/assignment"
import { getAllSpots } from "@renderer/api/spot"
import { getAllStudents } from "@renderer/api/student"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { AssignmentRow, SpotFull, Student } from "src/shared/types"

export const useManualAllocationView = (phaseId: number) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
    mutationFn: (phaseId: number) => deleteAllAssignmentsFromPhase(phaseId),
    onSuccess: () => {
      toast.success("Todas los otorgamientos de la fase fueron eliminadas.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.ASSIGNMENTS, phaseId] })

      localStorage.removeItem(`students_${phaseId}`)
      localStorage.removeItem(`spots_${phaseId}`)

      setStudentsCopy([])
      setSpotsCopy([])
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

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: [rqKeys.STUDENTS, phaseId],
    queryFn: () => getAllStudents(phaseId)
  })

  const { data: spots, isLoading: loadingSpots } = useQuery({
    queryKey: [rqKeys.SPOT, phaseId],
    queryFn: () => getAllSpots(phaseId)
  })

  const [formData, setFormData] = useState<{
    studentId: number | null
    spotId: number | null
  }>({
    studentId: null,
    spotId: null
  })

  const [studentsCopy, setStudentsCopy] = useState<Student[]>([])
  const [spotsCopy, setSpotsCopy] = useState<SpotFull[]>([])

  useEffect(() => {
    const storedStudents = localStorage.getItem(`students_${phaseId}`)
    const storedSpots = localStorage.getItem(`spots_${phaseId}`)

    if (storedStudents && storedSpots) {
      const parsedStudents: Student[] = JSON.parse(storedStudents)
      const parsedSpots: SpotFull[] = JSON.parse(storedSpots)

      parsedStudents.sort((a, b) => b.grade - a.grade)

      setStudentsCopy(parsedStudents)
      setSpotsCopy(parsedSpots)
    } else if (students && spots) {
      const orderedStudents = [...students].sort((a, b) => b.grade - a.grade)

      localStorage.setItem(`students_${phaseId}`, JSON.stringify(orderedStudents))
      localStorage.setItem(`spots_${phaseId}`, JSON.stringify(spots))

      setStudentsCopy(orderedStudents)
      setSpotsCopy(spots)
    }
  }, [spots, students, phaseId])

  const manualAssignMutation = useMutation({
    mutationFn: async ({ studentId, spotId }: { studentId: number; spotId: number }) => {
      await createAssignment({ studentId, spotId })

      setStudentsCopy((prevStudents) => {
        const updated = prevStudents.filter((s) => s.id !== studentId)
        localStorage.setItem(`students_${phaseId}`, JSON.stringify(updated))
        return updated
      })

      setSpotsCopy((prevSpots) => {
        const updated = prevSpots.map((spot) =>
          spot.spotId === spotId ? { ...spot, availableQuantity: spot.availableQuantity - 1 } : spot
        )
        localStorage.setItem(`spots_${phaseId}`, JSON.stringify(updated))
        return updated
      })
    },

    onSuccess: () => {
      toast.success("Plaza otorgada al aspirante correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.ASSIGNMENTS, phaseId] })
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
    if (!formData.studentId || !formData.spotId) {
      toast.error("Debe seleccionar un aspirante y una plaza.", {
        style: { color: "var(--errorMessage)" }
      })
      return
    }

    manualAssignMutation.mutate({
      studentId: formData.studentId,
      spotId: formData.spotId
    })

    resetForm()
  }

  const resetForm = () => {
    setFormData({ studentId: null, spotId: null })
    setIsDialogOpen(false)
  }

  return {
    isDialogOpen,
    setIsDialogOpen,
    paginatedAssignments,
    filteredAndSortedAssignments,
    loadingAssignments,
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
    studentsCopy,
    loadingStudents,
    spotsCopy,
    loadingSpots,
    formData,
    setFormData,
    handleSubmit,
    resetForm
  }
}
