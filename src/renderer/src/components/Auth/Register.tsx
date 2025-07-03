import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '../ui/select'
import { UserCheck, User, UserPlus, Eye, EyeOff, Lock } from 'lucide-react'

const Register = () => {

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
        <form onSubmit={() => null} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name-left">Nombre completo</Label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input id="full-name-left" type="text" placeholder="Escribe tu nombre completo" className="pl-10" />
            </div>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select
            //value={registerData.rol}
            //onValueChange={(value) => setRegisterData({ ...registerData, rol: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Crear Cuenta
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Register
