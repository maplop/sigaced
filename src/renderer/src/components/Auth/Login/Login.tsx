import { Button } from "@renderer/components/ui/button"
import { Input } from "@renderer/components/ui/input"
import { Label } from "@renderer/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@renderer/components/ui/card"
import { Lock, EyeOff, Eye, User, KeySquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@renderer/routes/routes"
import { useAuthContext } from "@renderer/context/AuthContext"
import LoginButton from "./LoginButton"
import { useState } from "react"
import { toast } from "sonner"
import { Checkbox } from "@renderer/components/ui/checkbox"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const username = formData.get('username')?.toString().trim()
    const password = formData.get('password')?.toString()

    // Validaciones básicas
    if (!username || !password) {
      toast.error("Por favor completa todos los campos.", {
        style: {
          color: 'var(--errorMessage)'
        }
      })
      return
    }

    try {
      const user = await login(username, password, rememberMe)

      if (!user) {
        toast.error("Credenciales incorrectas.", {
          style: {
            color: 'var(--errorMessage)'
          }
        })
        return
      }

      toast.success("Inicio de sesión exitoso.")
      navigate(ROUTES.STATISTICS)
    } catch (err) {
      toast.error("Error inesperado al intentar iniciar sesión.", {
        style: {
          color: 'var(--errorMessage)'
        }
      })
      console.error("Login error:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeySquare className="w-5 h-5" />
          Iniciar Sesión
        </CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input id="username" name="username" type="text" placeholder="Escribe tu usuario" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña"
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer hover:bg-transparent"
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
          <div className="flex items-center gap-3">
            <Checkbox id="terms" checked={rememberMe} onCheckedChange={() => setRememberMe(!rememberMe)} />
            <Label htmlFor="terms">Guardar mi sesión</Label>
          </div>
          <LoginButton />
        </form>
      </CardContent>
    </Card>
  )
}
export default Login