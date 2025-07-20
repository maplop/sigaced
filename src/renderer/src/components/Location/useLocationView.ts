import { getAllLocations } from "@renderer/api/location"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { Location } from "src/shared/types"

export const useLocationView = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof Location | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editinglocation, setEditinglocation] = useState<Location | null>(null)
  const [formData, setlocationFormData] = useState<Omit<Location, "id">>({
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
    handleSort
  }
}
