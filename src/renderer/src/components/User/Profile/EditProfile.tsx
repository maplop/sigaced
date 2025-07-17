import { Button } from "@renderer/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card"
import { Input } from "@renderer/components/ui/input"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser } from "@renderer/api/user"
import { UserFormData } from "../ManageUsers/useManageUsersView"
import { useState } from "react"
import { toast } from "sonner"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useAuthContext } from "@renderer/context/AuthContext"
import { User } from "src/shared/types"
import { updateUser as updatedLocalStorageUser } from "@renderer/utils/localStorage"

const EditProfile = () => {
  const { user, setUser } = useAuthContext()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<Omit<UserFormData, 'password'>>({
    name: user?.name ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
    role: user?.role ?? 'admin'
  })

  const mutation = useMutation({
    mutationFn: (data: Omit<User, 'createdAt'>) => updateUser(data),
    onSuccess: (success, updatedUser) => {
      if (!success) {
        toast.error("El nombre de usuario ya está en uso.", {
          style: { color: "var(--errorMessage)" }
        })
        return
      }
      queryClient.invalidateQueries({ queryKey: [rqKeys.USERS] })
      resetForm()
      setUser({ ...updatedUser, createdAt: user?.createdAt as string })
      updatedLocalStorageUser({ ...updatedUser, createdAt: user?.createdAt as string })
      toast.success("Usuario actualizado correctamente.")
    },
    onError: (error) => {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error al eliminar el usuario."
      toast.error(errorMessage, {
        style: { color: "var(--errorMessage)" }
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData && user) {
      const fullUser = {
        ...formData,
      }
      mutation.mutate({ ...fullUser, id: user.id, password: user.password })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      lastName: "",
      username: "",
      role: "admin"
    })
  }

  const isFormValid = formData.name !== '' && formData.lastName !== '' && formData.username !== '';

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>Editar perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => prev && { ...prev, name: e.target.value })}
              placeholder="Escribe tu nombre"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => prev && { ...prev, lastName: e.target.value })}
              placeholder="Escribe tus apellidos"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData((prev) => prev && { ...prev, username: e.target.value })}
              placeholder="Escribe tu usuario"
            />
          </div>
          {user?.role === 'admin' && (
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value: 'admin' | 'viewer') => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="viewer">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="absolute bottom-6 right-6">
            <Button type="submit" disabled={!isFormValid} className="w-full sm:w-auto">
              Editar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card >
  )
}
export default EditProfile
