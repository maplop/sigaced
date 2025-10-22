import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Spot, SpotFull } from "src/shared/types"
import {
  getAllSpots,
  createSpot,
  updateSpot,
  deleteSpot,
  deleteAllSpotsFromPhase
} from "@renderer/api/spot"
import { getAllCareers } from "@renderer/api/career"
import { getAllLocations } from "@renderer/api/location"
import { PhaseType } from "@renderer/utils/types"

export const useSpotView = (phaseId: PhaseType) => {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof SpotFull | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpot, setEditingSpot] = useState<SpotFull | null>(null)
  const [formData, setFormData] = useState<Omit<Spot, "id">>({
    careerId: undefined,
    locationId: undefined,
    phaseId: phaseId,
    availableQuantity: 0
  })

  const { data, isLoading: loadingSpots } = useQuery({
    queryKey: [rqKeys.SPOT, phaseId],
    queryFn: () => getAllSpots(phaseId)
  })

  const { data: careers, isLoading: loadingCareers } = useQuery({
    queryKey: [rqKeys.CAREERS],
    queryFn: getAllCareers
  })

  const { data: locations, isLoading: loadingLocations } = useQuery({
    queryKey: [rqKeys.LOCATIONS],
    queryFn: getAllLocations
  })

  // Filtrado y ordenamiento
  const filteredAndSortedSpots = useMemo(() => {
    if (!data) return []

    // Filtro: busca término en carrera, localización o fase
    const filtered = data.filter((spot) => {
      const term = searchTerm.toLowerCase()
      return (
        spot.careerName.toLowerCase().includes(term) ||
        spot.locationName.toLowerCase().includes(term) ||
        spot.phaseName.toLowerCase().includes(term)
      )
    })

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: string | number = a[sortField]!
        let bValue: string | number = b[sortField]!

        // Normaliza strings para comparación
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
  }, [data, searchTerm, sortField, sortDirection])

  const paginatedSpots: SpotFull[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedSpots.slice(startIndex, endIndex)
  }, [filteredAndSortedSpots, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedSpots?.length / itemsPerPage)
  }, [filteredAndSortedSpots, itemsPerPage])

  const handleSort = (field: keyof SpotFull) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSpotSubmit = async (spot: Omit<Spot, "id">) => {
    if (!editingSpot) {
      return await createSpot(spot)
    }
    return await updateSpot({ ...spot, id: editingSpot.spotId })
  }

  const mutation = useMutation({
    mutationFn: handleSpotSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rqKeys.SPOT] })
      if (editingSpot) {
        resetForm()
      } else {
        resetFormWithoutClosing()
      }
      toast.success(
        editingSpot ? "Plaza actualizada correctamente." : "Plaza creada correctamente."
      )
    },
    onError: (error) => {
      console.error("Error procesando plaza:", error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : editingSpot
            ? "Error al editar la plaza."
            : "Error al crear la plaza"
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

  const handleEdit = (spot: SpotFull) => {
    setEditingSpot(spot)
    setFormData({
      careerId: spot.careerId,
      locationId: spot.locationId,
      phaseId: spot.phaseId,
      availableQuantity: spot.availableQuantity
    })
    setIsDialogOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteSpot,
    onSuccess: () => {
      toast.success("Plaza eliminada correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.SPOT] })
      resetForm()
    },
    onError: (error) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar la plaza."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDelete = (spotId: number) => {
    deleteMutation.mutate(spotId)
  }

  const deleteAllFromPhaseMutation = useMutation({
    mutationFn: () => deleteAllSpotsFromPhase(phaseId),
    onSuccess: () => {
      toast.success("Todas las plazas de la fase fueron eliminadas correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.SPOT, phaseId] })
      resetForm()
    },
    onError: (error) => {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar todas las plazas de la fase."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDeleteAllFromPhase = () => {
    deleteAllFromPhaseMutation.mutate()
  }

  const resetForm = () => {
    setFormData({
      careerId: undefined,
      locationId: undefined,
      phaseId: phaseId,
      availableQuantity: 0
    })
    setEditingSpot(null)
    setIsDialogOpen(false)
  }

  const resetFormWithoutClosing = () => {
    setFormData({
      careerId: undefined,
      locationId: undefined,
      phaseId: phaseId,
      availableQuantity: 0
    })
    setEditingSpot(null)
  }

  return {
    paginatedSpots,
    loadingSpots,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    careers,
    loadingCareers,
    locations,
    loadingLocations,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedSpots,
    handleSort,
    isDialogOpen,
    setIsDialogOpen,
    editingSpot,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleDeleteAllFromPhase
  }
}
