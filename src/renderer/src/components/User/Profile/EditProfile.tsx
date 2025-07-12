import { Button } from "@renderer/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card"
import { Input } from "@renderer/components/ui/input"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"

const EditProfile = () => {

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>Editar perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <form onSubmit={() => null} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" type="text" placeholder="Escribe tu nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input id="lastName" name="lastName" type="text" placeholder="Escribe tus apellidos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" name="username" type="text" placeholder="Escribe tu usuario" />
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
          <div className="absolute bottom-6 right-6">
            <Button type="submit" className="w-full sm:w-auto">
              Editar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default EditProfile
