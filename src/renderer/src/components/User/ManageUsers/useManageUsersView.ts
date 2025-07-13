import { useMemo, useState } from "react"
import { getAllUsers } from "@renderer/api/user"
import { User } from "src/shared/types"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useQuery } from "@tanstack/react-query"

export type Estado = "Pendiente" | "Aprobado" | "Rechazado"

export interface UserFormData {
  name: string
  lastName: string
  username: string
  password: string
  role: "admin" | "viewer"
}

export const useManageUsersView = () => {
  const { data, isLoading: loadingUsers } = useQuery({
    queryKey: [rqKeys.USERS],
    queryFn: getAllUsers
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof User | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setUserFormData] = useState<UserFormData>({
    name: "",
    lastName: "",
    username: "",
    password: "",
    role: "admin"
  })

  // Filtrado y ordenamiento
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = data?.filter((user) =>
      `${user.name} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  const paginatedUsers: User[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedUsers.slice(startIndex, endIndex)
  }, [filteredAndSortedUsers, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedUsers?.length / itemsPerPage)
  }, [filteredAndSortedUsers, itemsPerPage])

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const userData: Omit<User, "id"> = {
      name: formData.name,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      role: formData.role
    }

    if (editingUser) {
      //setUsers((prev) => prev.map((a) => (a.id === editingUser.id ? userData : a)))
    } else {
      //setUsers((prev) => [...prev, userData])
    }

    resetForm()
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setUserFormData({
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
      role: user.role
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    //setUsers((prev) => prev.filter((a) => a.id !== id))
  }

  const resetForm = () => {
    setUserFormData({
      name: "",
      lastName: "",
      username: "",
      password: "",
      role: "admin"
    })
    setEditingUser(null)
    setIsDialogOpen(false)
  }

  return {
    loadingUsers,
    paginatedUsers,
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
    editingUser,
    formData,
    setUserFormData,
    filteredAndSortedUsers,
    handleSort,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  }
}
