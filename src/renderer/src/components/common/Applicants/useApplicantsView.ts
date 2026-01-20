import { useMemo, useState } from "react"
import { PhaseType } from "@renderer/utils/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { rqKeys } from "@renderer/utils/rqKeys"
import {
  createApplicant,
  deleteAllApplicantsFromPhase,
  deleteApplicant,
  getAllApplicants,
  updateApplicant
} from "@renderer/api/applicant"
import { Applicant } from "src/shared/types"
import { toast } from "sonner"
import { getPhaseName } from "@renderer/utils/getPhaseName"
import { exportPDF } from "@renderer/api/pdf"

type SortableField = keyof Applicant | "requestsCount"

export const useApplicantsView = (phaseId: PhaseType) => {
  const queryClient = useQueryClient()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<SortableField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null)

  const [formData, setFormData] = useState<Omit<Applicant, "id">>({
    ci: "",
    name: "",
    lastName: "",
    grade: 60.0,
    gender: "F",
    municipality: "",
    phaseId: phaseId,
    requests: phaseId === 3 ? undefined : [{ spotId: 0, preferenceOrder: 1 as 1 }]
  })

  const { data: applicants, isLoading: loadingApplicants } = useQuery({
    queryKey: [rqKeys.APPLICANTS, phaseId],
    queryFn: () => getAllApplicants(phaseId)
  })

  // Filtrado y ordenamiento
  const filteredAndSortedApplicants = useMemo(() => {
    if (!applicants) return []

    const filtered = applicants.filter((applicant) =>
      `${applicant.name} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [applicants, searchTerm, sortField, sortDirection])

  const paginatedApplicants: Applicant[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedApplicants.slice(startIndex, endIndex)
  }, [filteredAndSortedApplicants, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedApplicants.length / itemsPerPage)
  }, [filteredAndSortedApplicants, itemsPerPage])

  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleApplicantSubmit = async (applicant: Omit<Applicant, "id">) => {
    if (!editingApplicant) {
      return await createApplicant(applicant)
    } else {
      return await updateApplicant({ ...applicant, id: editingApplicant.id })
    }
  }

  const mutation = useMutation({
    mutationFn: handleApplicantSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rqKeys.APPLICANTS] })
      if (editingApplicant) {
        resetForm()
      } else {
        resetFormWithoutClosing()
      }
      toast.success(
        editingApplicant
          ? "Datos del aspirante actualizados correctamente."
          : "Aspirante creado correctamente."
      )
    },
    onError: (error) => {
      console.error("Error procesando aspirante:", error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : editingApplicant
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

    // Validación del CI: 11 dígitos numéricos
    if (!/^[0-9]{11}$/.test(formData.ci)) {
      toast.error("El CI debe tener exactamente 11 dígitos numéricos.", {
        style: { color: "var(--errorMessage)" }
      })
      return
    }

    // Validación de la nota: entre 60 y 100
    if (formData.grade < 60 || formData.grade > 100) {
      toast.error("La nota debe estar entre 60 y 100.", {
        style: { color: "var(--errorMessage)" }
      })
      return
    }

    if (phaseId !== 3 && (!formData.requests || formData.requests.length === 0)) {
      toast.error("El aspirante debe tener al menos una solicitud.", {
        style: { color: "var(--errorMessage)" }
      })
      return
    }

    // Validar que ningún spotId sea 0 o negativo, solo si hay requests
    if (formData.requests && formData.requests.some((req) => req.spotId <= 0)) {
      toast.error("Debe seleccionar una plaza válida para cada solicitud.", {
        style: { color: "var(--errorMessage)" }
      })
      return
    }

    mutation.mutate(formData)
  }

  const handleEdit = (applicant: Applicant) => {
    setEditingApplicant(applicant)
    setFormData({
      ci: applicant.ci,
      name: applicant.name,
      lastName: applicant.lastName,
      grade: applicant.grade,
      gender: applicant.gender,
      municipality: applicant.municipality,
      phaseId: phaseId,
      requests: applicant.requests
    })
    setIsDialogOpen(true)
  }

  const deleteApplicantMutation = useMutation({
    mutationFn: deleteApplicant,
    onSuccess: () => {
      toast.success("Aspirante eliminado correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.APPLICANTS] })
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

  const handleDeleteApplicant = (applicantId: number) => {
    deleteApplicantMutation.mutate(applicantId)
  }

  const deleteAllFromPhaseMutation = useMutation({
    mutationFn: () => deleteAllApplicantsFromPhase(phaseId),
    onSuccess: () => {
      toast.success("Todos los aspirantes de la fase fueron eliminados correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.APPLICANTS, phaseId] })
      resetForm()
    },
    onError: (error) => {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar los aspirantes de la fase."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDeleteAllFromPhase = () => {
    deleteAllFromPhaseMutation.mutate()
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
      grade: 60.0,
      gender: "F",
      municipality: "",
      phaseId: phaseId,
      requests: phaseId === 3 ? undefined : [{ spotId: 0, preferenceOrder: 1 as 1 }]
    })
    setEditingApplicant(null)
    setIsDialogOpen(false)
  }

  const resetFormWithoutClosing = () => {
    setFormData({
      ci: "",
      name: "",
      lastName: "",
      grade: 60.0,
      gender: "F",
      municipality: "",
      phaseId: phaseId,
      requests: phaseId === 3 ? undefined : [{ spotId: 0, preferenceOrder: 1 as 1 }]
    })
    setEditingApplicant(null)
  }

  const applicantsTable = [
    ["#", "CI", "Apellidos", "Nombre", "Nota", "Género", "Municipio"],
    ...filteredAndSortedApplicants.map((applicant, index) => [
      index + 1,
      applicant.ci,
      applicant.lastName,
      applicant.name,
      applicant.grade.toFixed(2),
      applicant.gender,
      applicant.municipality
    ])
  ]

  const handleExportPDF = async () => {
    try {
      const path = await exportPDF({
        subtitle: `Listado de Aspirantes (${getPhaseName(phaseId)})`,
        table: applicantsTable,
        columnWidths: [20, 60, "auto", "auto", 50, 50, 100],
        columnAlignments: ["center", "center", "left", "left", "center", "center", "left"],
        saveName: `Listado de Aspirantes ${getPhaseName(phaseId)}.pdf`
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
    paginatedApplicants,
    loadingApplicants,
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
    editingApplicant,
    formData,
    setFormData,
    filteredAndSortedApplicants,
    handleSort,
    handleSubmit,
    handleEdit,
    handleDeleteApplicant,
    addRequest,
    updateRequest,
    removeRequest,
    handleDeleteAllFromPhase,
    resetForm,
    handleExportPDF
  }
}
