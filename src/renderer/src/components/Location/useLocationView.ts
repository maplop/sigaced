import {
  createLocation,
  deleteLocation,
  editLocation,
  getAllLocations
} from "@renderer/api/location"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Location } from "src/shared/types"

export const useLocationView = () => {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof Location | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState<Omit<Location, "id">>({
    name: ""
  })

  const { data, isLoading: loadingLocations } = useQuery({
    queryKey: [rqKeys.LOCATIONS],
    queryFn: getAllLocations
  })

  // Filtrado y ordenamiento
  const filteredAndSortedLocations = useMemo(() => {
    const filtered = data?.filter((location) =>
      `${location.name}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  const paginatedLocations: Location[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedLocations.slice(startIndex, endIndex)
  }, [filteredAndSortedLocations, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedLocations?.length / itemsPerPage)
  }, [filteredAndSortedLocations, itemsPerPage])

  const handleSort = (field: keyof Location) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleLocationSubmit = async (location: Omit<Location, "id">) => {
    if (!editingLocation) {
      return await createLocation(location)
    }
    return await editLocation({ ...location, id: editingLocation.id })
  }

  const mutation = useMutation({
    mutationFn: handleLocationSubmit,
    onSuccess: (data) => {
      if (data === null || data === false) {
        toast.error("Ocurrió un error al procesar el usuario. Intenta nuevamente.", {
          style: {
            color: "var(--errorMessage)"
          }
        })
        return
      }
      queryClient.invalidateQueries({ queryKey: [rqKeys.LOCATIONS] })
      resetForm()
      toast.success(
        editingLocation
          ? "Localización actualizada correctamente."
          : "Localización creada correctamente."
      )
    },
    onError: (error) => {
      console.error("Error procesando localización:", error)
      toast.error("Ocurrió un error al procesar la localización. Intenta nuevamente.", {
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

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name
    })
    setIsDialogOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: (_, id) => {
      if (!id) {
        toast.error("Ha ocurrido un error. No se encuentra la localización.", {
          style: { color: "var(--errorMessage)" }
        })
        return
      }
      toast.success("Localización eliminada correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.LOCATIONS] })
      resetForm()
    },
    onError: (error: unknown) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar la localización."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const resetForm = () => {
    setFormData({ name: "" })
    setEditingLocation(null)
    setIsDialogOpen(false)
  }

  return {
    paginatedLocations,
    loadingLocations,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedLocations,
    handleSort,
    isDialogOpen,
    setIsDialogOpen,
    editingLocation,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete
  }
}
