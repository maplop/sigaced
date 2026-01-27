import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Eye, EyeOff, Plus } from "lucide-react"
import { User } from "src/shared/types"
import { UserFormData } from "../useManageUsersView"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { useState } from "react"
import { Checkbox } from "@renderer/components/ui/checkbox"


interface UserFormProps {
  changePassword: boolean
  setChangePassword: React.Dispatch<React.SetStateAction<boolean>>
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingUser: User | null,
  handleSubmit: (e: React.FormEvent) => void,
  formData: UserFormData,
  setUserFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
}

const UserForm = ({ changePassword, setChangePassword, isDialogOpen, setIsDialogOpen, resetForm, editingUser, handleSubmit, formData, setUserFormData }: UserFormProps) => {

  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {editingUser ? "Modifica los datos del usuario" : "Completa la información del nuevo usuario"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  name="role"
                  value={formData.role}
                  onValueChange={(value: "admin" | 'viewer') => setUserFormData((prev) => ({ ...prev, role: value }))}
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
            </div>
            {editingUser && (
              <div className="flex items-center gap-3">
                <Checkbox
                  id="changePassword"
                  checked={changePassword}
                  onCheckedChange={() => setChangePassword(!changePassword)}
                />
                <Label htmlFor="changePassword">Cambiar Contraseña</Label>
              </div>
            )}

            {(!editingUser || changePassword) && (
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setUserFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit">{editingUser ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default UserForm
