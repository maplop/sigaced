import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Lock, EyeOff, Eye, User, KeySquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@renderer/routes/routes"

export function Login() {
  const navigate = useNavigate()
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
        <form onSubmit={() => null} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-left">Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input id="user-left" type="text" placeholder="Escribe tu usuario" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-toggle">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password-toggle"
                type={true ? "text" : "password"}
                placeholder="Escribe tu contraseña"
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => null}
              >
                {true ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            onClick={() => navigate(ROUTES.STATISTICS)}
          >
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
