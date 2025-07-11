import { useMemo, useState } from "react"
import { fakeApplicants } from "@renderer/fakeData/applicants"
import { v4 as uuid } from "uuid"

export type Estado = "Pendiente" | "Aprobado" | "Rechazado"

export interface Aspirante {
  id: string
  ci: string
  name: string
  lastName: string
  grade: number
  age: number
  gender: "M" | "F"
  municipality: string
}

export interface FormData {
  ci: string
  name: string
  lastName: string
  grade: number
  age: number
  gender: "M" | "F"
  municipality: string
}

export const carrerasDisponibles = [
  "Ingeniería de Sistemas",
  "Medicina",
  "Derecho",
  "Administración",
  "Psicología",
  "Arquitectura",
  "Contaduría",
  "Diseño Gráfico"
]

export const estadosDisponibles = ["Pendiente", "Aprobado", "Rechazado"]

export const useApplicantsView = () => {
  const [aspirantes, setAspirantes] = useState<Aspirante[]>(fakeApplicants || [])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<keyof Aspirante | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAspirante, setEditingAspirante] = useState<Aspirante | null>(null)
  const [formData, setFormData] = useState<FormData>({
    ci: "",
    name: "",
    lastName: "",
    grade: 0,
    age: 18,
    gender: "F",
    municipality: ""
  })

  // Filtrado y ordenamiento
  const filteredAndSortedAspirantes = useMemo(() => {
    const filtered = aspirantes.filter((aspirante) =>
      `${aspirante.name} ${aspirante.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortField) {
      filtered.sort((a, b) => {
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

    return filtered
  }, [aspirantes, searchTerm, sortField, sortDirection])

  const paginatedAspirantes: Aspirante[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedAspirantes.slice(startIndex, endIndex)
  }, [filteredAndSortedAspirantes, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedAspirantes.length / itemsPerPage)
  }, [filteredAndSortedAspirantes, itemsPerPage])

  const handleSort = (field: keyof Aspirante) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const aspiranteData: Aspirante = {
      id: editingAspirante?.id || uuid(),
      ci: formData.ci,
      name: formData.name,
      lastName: formData.lastName,
      grade: formData.grade,
      age: formData.age,
      gender: formData.gender,
      municipality: formData.municipality
    }

    if (editingAspirante) {
      setAspirantes((prev) => prev.map((a) => (a.id === editingAspirante.id ? aspiranteData : a)))
    } else {
      setAspirantes((prev) => [...prev, aspiranteData])
    }

    resetForm()
  }

  const handleEdit = (aspirante: Aspirante) => {
    setEditingAspirante(aspirante)
    setFormData({
      ci: aspirante.ci,
      name: aspirante.name,
      lastName: aspirante.lastName,
      grade: aspirante.grade,
      age: aspirante.age,
      gender: aspirante.gender,
      municipality: aspirante.municipality
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAspirantes((prev) => prev.filter((a) => a.id !== id))
  }

  const resetForm = () => {
    setFormData({
      ci: "",
      name: "",
      lastName: "",
      grade: 0,
      age: 18,
      gender: "F",
      municipality: ""
    })
    setEditingAspirante(null)
    setIsDialogOpen(false)
  }

  return {
    paginatedAspirantes,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    carrerasDisponibles,
    estadosDisponibles,
    searchTerm,
    setSearchTerm,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    isDialogOpen,
    setIsDialogOpen,
    editingAspirante,
    setEditingAspirante,
    formData,
    setFormData,
    filteredAndSortedAspirantes,
    handleSort,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  }
}
