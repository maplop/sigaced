import {
  createCareer,
  deleteAllCareers,
  deleteCareer,
  editCareer,
  getAllCareers
} from "@renderer/api/career"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Career } from "src/shared/types"

export const useCareerView = () => {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof Career | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)
  const [formData, setFormData] = useState<Omit<Career, "id">>({
    fullName: "",
    abbreviation: "",
    faculty: ""
  })

  const { data, isLoading: loadingCareers } = useQuery({
    queryKey: [rqKeys.CAREERS],
    queryFn: getAllCareers
  })

  // Filtrado y ordenamiento
  const filteredAndSortedCareers = useMemo(() => {
    const filtered = data?.filter((career) =>
      `${career.fullName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortField) {
      filtered?.sort((a, b) => {
        let aValue = a[sortField]
        let bValue = b[sortField]

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase()
          bValue = (bValue as string).toLowerCase()
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered ?? []
  }, [data, searchTerm, sortField, sortDirection])

  const paginatedCareers: Career[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedCareers.slice(startIndex, endIndex)
  }, [filteredAndSortedCareers, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedCareers?.length / itemsPerPage)
  }, [filteredAndSortedCareers, itemsPerPage])

  const handleSort = (field: keyof Career) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleCareerSubmit = async (career: Omit<Career, "id">) => {
    if (!editingCareer) {
      return await createCareer(career)
    }
    return await editCareer({ ...career, id: editingCareer.id })
  }

  const mutation = useMutation({
    mutationFn: handleCareerSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rqKeys.CAREERS] })
      if (editingCareer) {
        resetForm()
      } else {
        resetFormWithoutClosing()
      }
      toast.success(
        editingCareer ? "Carrera actualizada correctamente." : "Carrera creada correctamente."
      )
    },
    onError: (error) => {
      console.error("Error procesando carrera:", error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : editingCareer
            ? "Error al editar carrera."
            : "Error al crear carrera."
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

  const handleEdit = (career: Career) => {
    setEditingCareer(career)
    setFormData({
      fullName: career.fullName,
      abbreviation: career.abbreviation,
      faculty: career.faculty
    })
    setIsDialogOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      toast.success("Carrera eliminada correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.CAREERS] })
      resetForm()
    },
    onError: (error: unknown) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar la carrera."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllCareers,
    onSuccess: () => {
      toast.success("Todas las carreras y sus datos asociados han sido eliminadas correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.CAREERS] })
      resetForm()
    },
    onError: (error: unknown) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar todas las carreras."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDeleteAll = () => {
    deleteAllMutation.mutate()
  }

  const resetForm = () => {
    setFormData({ fullName: "", abbreviation: "", faculty: "" })
    setEditingCareer(null)
    setIsDialogOpen(false)
  }

  const resetFormWithoutClosing = () => {
    setFormData({ fullName: "", abbreviation: "", faculty: "" })
    setEditingCareer(null)
  }

  return {
    paginatedCareers,
    loadingCareers,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedCareers,
    handleSort,
    isDialogOpen,
    setIsDialogOpen,
    editingCareer,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleDeleteAll
  }
}
