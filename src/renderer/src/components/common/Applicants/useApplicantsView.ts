import { useMemo, useState } from "react"
import { PhaseType } from "@renderer/utils/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { rqKeys } from "@renderer/utils/rqKeys"
import {
  createStudent,
  deleteStudentFromPhase,
  getAllStudents,
  updateStudent
} from "@renderer/api/student"
import { Student } from "src/shared/types"
import { toast } from "sonner"

type SortableField = keyof Student | "requestsCount"

export const useApplicantsView = (phaseId: PhaseType) => {
  const queryClient = useQueryClient()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<SortableField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Omit<Student, "id">>({
    ci: "",
    name: "",
    lastName: "",
    grade: 0.0,
    age: 18,
    gender: "F",
    municipality: "",
    phaseId: phaseId,
    requests: []
  })

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: [rqKeys.STUDENTS, phaseId],
    queryFn: () => getAllStudents(phaseId)
  })

  // Filtrado y ordenamiento
  const filteredAndSortedStudents = useMemo(() => {
    if (!students) return []

    const filtered = students.filter((student) =>
      `${student.name} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortField) {
      return [...filtered].sort((a, b) => {
        let aValue: any
        let bValue: any

        if (sortField === "requestsCount") {
          aValue = a.requests?.length ?? 0
          bValue = b.requests?.length ?? 0
        } else {
          aValue = a[sortField]
          bValue = b[sortField]
        }

        if (aValue == null) return 1
        if (bValue == null) return -1

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [students, searchTerm, sortField, sortDirection])

  const paginatedStudents: Student[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedStudents.slice(startIndex, endIndex)
  }, [filteredAndSortedStudents, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedStudents.length / itemsPerPage)
  }, [filteredAndSortedStudents, itemsPerPage])

  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleStudentSubmit = async (student: Omit<Student, "id">) => {
    if (!editingStudent) {
      return await createStudent(student)
    } else {
      return await updateStudent({ ...student, id: editingStudent.id })
    }
  }

  const mutation = useMutation({
    mutationFn: handleStudentSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rqKeys.STUDENTS] })
      resetForm()
      toast.success(
        editingStudent
          ? "Datos del aspirante actualizados correctamente."
          : "Aspirante creado correctamente."
      )
    },
    onError: (error) => {
      console.error("Error procesando estudante:", error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : editingStudent
            ? "Error al editar los datos del aspirante."
            : "Error al crear aspirante."
      toast.error(errorMessage, {
        style: {
          color: "var(--errorMessage)"
        }
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      ci: student.ci,
      name: student.name,
      lastName: student.lastName,
      grade: student.grade,
      age: student.age,
      gender: student.gender,
      municipality: student.municipality,
      phaseId: phaseId,
      requests: student.requests
    })
    setIsDialogOpen(true)
  }

  type DeleteStudentPayload = { studentId: number; phaseId: number }

  const deleteFromPhaseMutation = useMutation({
    mutationFn: ({ studentId, phaseId }: DeleteStudentPayload) =>
      deleteStudentFromPhase(studentId, phaseId),
    onSuccess: () => {
      toast.success("Aspirante eliminado correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.STUDENTS] })
      resetForm()
    },
    onError: (error) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar el aspirante."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDeleteFromPhase = (studentId: number) => {
    deleteFromPhaseMutation.mutate({ studentId, phaseId })
  }

  // Agregar nueva solicitud (máximo 3)
  const addRequest = () => {
    setFormData((prev) => {
      const currentLength = prev.requests?.length || 0
      if (currentLength >= 3) return prev
      return {
        ...prev,
        requests: [
          ...(prev.requests || []),
          { spotId: 0, preferenceOrder: (currentLength + 1) as 1 | 2 | 3 }
        ]
      }
    })
  }

  // Actualizar solicitud en una posición específica
  const updateRequest = (index: number, spotId: number) => {
    setFormData((prev) => ({
      ...prev,
      requests: prev.requests?.map((req, i) => (i === index ? { ...req, spotId } : req)) || []
    }))
  }

  // Eliminar solicitud en una posición específica
  const removeRequest = (index: number) => {
    setFormData((prev) => {
      const updated = prev.requests?.filter((_, i) => i !== index) || []
      // Reordenar preferenceOrder
      return {
        ...prev,
        requests: updated.map((req, i) => ({ ...req, preferenceOrder: (i + 1) as 1 | 2 | 3 }))
      }
    })
  }

  const resetForm = () => {
    setFormData({
      ci: "",
      name: "",
      lastName: "",
      grade: 0.0,
      age: 18,
      gender: "F",
      municipality: "",
      phaseId: phaseId,
      requests: []
    })
    setEditingStudent(null)
    setIsDialogOpen(false)
  }

  return {
    paginatedStudents,
    loadingStudents,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    isDialogOpen,
    setIsDialogOpen,
    editingStudent,
    formData,
    setFormData,
    filteredAndSortedStudents,
    handleSort,
    handleSubmit,
    handleEdit,
    handleDeleteFromPhase,
    addRequest,
    updateRequest,
    removeRequest,
    resetForm
  }
}
