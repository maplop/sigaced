import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Spot } from "src/shared/types"
import { getAllSpots, createSpot, editSpot, deleteSpot } from "@renderer/api/spot"
import { getAllCareers } from "@renderer/api/career"
import { getAllLocations } from "@renderer/api/location"

export const useSpotView = () => {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof Spot | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null)
  const [formData, setFormData] = useState<Omit<Spot, "id">>({
    careerId: "",
    locationId: "",
    availableQuantity: 0
  })

  const { data, isLoading: loadingSpots } = useQuery({
    queryKey: [rqKeys.SPOT],
    queryFn: getAllSpots
  })

  const { data: careers, isLoading: loadingCareers } = useQuery({
    queryKey: [rqKeys.CAREERS],
    queryFn: getAllCareers
  })

  const { data: locations, isLoading: loadingLocations } = useQuery({
    queryKey: [rqKeys.LOCATIONS],
    queryFn: getAllLocations
  })

  const careerMap = useMemo(() => {
    const map = new Map<string, string>()
    careers?.forEach((c) => map.set(c.id.toString(), c.fullName))
    return map
  }, [careers])

  const locationMap = useMemo(() => {
    const map = new Map<string, string>()
    locations?.forEach((l) => map.set(l.id.toString(), l.name))
    return map
  }, [locations])

  // Filtrado y ordenamiento
  const filteredAndSortedSpots = useMemo(() => {
    const filtered = data?.filter((spot) => {
      const careerName = careerMap.get(spot.careerId.toString())?.toLowerCase() ?? ""
      const locationName = locationMap.get(spot.locationId.toString())?.toLowerCase() ?? ""

      return (
        careerName.includes(searchTerm.toLowerCase()) ||
        locationName.includes(searchTerm.toLowerCase())
      )
    })

    if (sortField) {
      filtered?.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        if (sortField === "careerId") {
          aValue = careerMap.get(a.careerId.toString()) ?? ""
          bValue = careerMap.get(b.careerId.toString()) ?? ""
        } else if (sortField === "locationId") {
          aValue = locationMap.get(a.locationId.toString()) ?? ""
          bValue = locationMap.get(b.locationId.toString()) ?? ""
        } else {
          aValue = a[sortField]
          bValue = b[sortField]
        }

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
  }, [data, searchTerm, sortField, sortDirection, careerMap, locationMap])

  const paginatedSpots: Spot[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedSpots.slice(startIndex, endIndex)
  }, [filteredAndSortedSpots, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedSpots?.length / itemsPerPage)
  }, [filteredAndSortedSpots, itemsPerPage])

  const handleSort = (field: keyof Spot) => {
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
    return await editSpot({ ...spot, id: editingSpot.id })
  }

  const mutation = useMutation({
    mutationFn: handleSpotSubmit,
    onSuccess: (data) => {
      if (data === null || data === false) {
        toast.error("Ocurrió un error al procesar el usuario. Intenta nuevamente.", {
          style: {
            color: "var(--errorMessage)"
          }
        })
        return
      }
      queryClient.invalidateQueries({ queryKey: [rqKeys.SPOT] })
      resetForm()
      toast.success(
        editingSpot ? "Plaza actualizada correctamente." : "Plaza creada correctamente."
      )
    },
    onError: (error) => {
      console.error("Error procesando plaza:", error)
      toast.error("Ocurrió un error al procesar la plaza. Intenta nuevamente.", {
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

  const handleEdit = (spot: Spot) => {
    setEditingSpot(spot)
    setFormData({
      careerId: spot.careerId,
      locationId: spot.locationId,
      availableQuantity: spot.availableQuantity
    })
    setIsDialogOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteSpot,
    onSuccess: (_, id) => {
      if (!id) {
        toast.error("Ha ocurrido un error. No se encuentra la plaza.", {
          style: { color: "var(--errorMessage)" }
        })
        return
      }
      toast.success("Plaza eliminada correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.SPOT] })
      resetForm()
    },
    onError: (error: unknown) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar la plaza."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const resetForm = () => {
    setFormData({
      careerId: "",
      locationId: "",
      availableQuantity: 0
    })
    setEditingSpot(null)
    setIsDialogOpen(false)
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
    careerMap,
    locations,
    loadingLocations,
    locationMap,
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
    handleDelete
  }
}
