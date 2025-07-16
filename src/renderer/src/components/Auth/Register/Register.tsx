import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { Label } from '@renderer/components/ui/label'
import { Input } from '@renderer/components/ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@renderer/components/ui/select'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import RegisterButton from './RegisterButton'
import { register } from '@renderer/api/user'
import { toast } from 'sonner'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from "@renderer/routes/routes"
import { hashPassword } from '@renderer/utils/encryption'

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const userData = {
      name: formData.get('name') as string,
      lastName: formData.get('lastName') as string,
      username: formData.get('username') as string,
      password: hashPassword(formData.get('password') as string),
      role: formData.get('role') as "admin" | "viewer"
    }

    if (
      !userData.name ||
      !userData.lastName ||
      !userData.username ||
      !userData.password ||
      !userData.role
    ) {
      toast.error('Por favor completa todos los campos.', {
        style: {
          color: 'var(--errorMessage)'
        }
      })
      return
    }
    try {
      const res = await register(userData)
      if (!res) {
        toast.error('El nombre de usuario ya está en uso.', {
          style: {
            color: 'var(--errorMessage)'
          }
        })
        return
      }
      toast.success('Usuario registrado satisfactoriamente.',)
      form.reset()
      navigate(ROUTES.LOGIN)
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Error al crear el usuario.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Crear Cuenta
        </CardTitle>
        <CardDescription>Completa los datos para crear tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" type="text" placeholder="Escribe tu nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input id="lastName" name="lastName" type="text" placeholder="Escribe tus apellidos" />
          </div>
          <div className="flex space-x-2">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" name="username" type="text" placeholder="Escribe tu usuario" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Escribe tu contraseña"
                  className="pr-10"
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select name="role" defaultValue='admin'>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="viewer">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <RegisterButton />
        </form>
      </CardContent>
    </Card>
  )
}

export default Register
