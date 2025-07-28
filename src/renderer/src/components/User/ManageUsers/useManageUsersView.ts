import { useMemo, useState } from "react"
import { deleteUser, getAllUsers, register, updateUser } from "@renderer/api/user"
import { User } from "src/shared/types"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { hashPassword } from "@renderer/utils/encryption"

export interface UserFormData {
  name: string
  lastName: string
  username: string
  password: string
  role: "admin" | "viewer"
}

export const useManageUsersView = () => {
  const queryClient = useQueryClient()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [changePassword, setChangePassword] = useState<boolean>(false)

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

  const { data = [], isLoading: loadingUsers } = useQuery({
    queryKey: [rqKeys.USERS],
    queryFn: getAllUsers
  })

  const handleUserSubmit = async (user: UserFormData) => {
    if (!editingUser) {
      // Nuevo usuario
      return await register({
        ...user,
        password: hashPassword(user.password)
      })
    }

    const payload: Omit<User, "createdAt"> = {
      id: editingUser.id,
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
      password: changePassword ? hashPassword(user.password) : editingUser.password
    }

    return await updateUser(payload)
  }

  const mutation = useMutation({
    mutationFn: handleUserSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rqKeys.USERS] })
      resetForm()
      toast.success(
        editingUser ? "Usuario actualizado correctamente." : "Usuario creado correctamente."
      )
    },
    onError: (error) => {
      console.error("Registration error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error al registrar el usuario."
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

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setUserFormData({
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      password: "",
      role: user.role
    })
    setIsDialogOpen(true)
    setChangePassword(false)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      toast.success("Usuario eliminado correctamente.")
      queryClient.invalidateQueries({ queryKey: [rqKeys.USERS] })
      if (editingUser?.id === id) resetForm()
    },
    onError: (error: unknown) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar el usuario."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
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
    setChangePassword(false)
  }

  return {
    changePassword,
    setChangePassword,
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
