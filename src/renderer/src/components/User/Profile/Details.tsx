import { Avatar, AvatarFallback, AvatarImage } from "@renderer/components/ui/avatar"
import { Card, CardHeader, CardContent } from "@renderer/components/ui/card"
import { Label } from "@renderer/components/ui/label"
import { Badge } from "@renderer/components/ui/badge"
import { useAuthContext } from "@renderer/context/AuthContext"

const Details = () => {
  const { user } = useAuthContext()
  return (
    <Card className="w-full relative overflow-hidden">
      <div className="absolute top-0 w-full h-[100px] bg-[var(--primary)]" />
      <CardHeader>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="w-20 h-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="border-4 border-white">{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Label className="text-[18px] my-2">{user?.name} {user?.lastName}</Label>
        <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>{user?.role === 'admin' ? 'Administrador' : 'Supervisor'}</Badge>
        <div className="flex justify-between w-full mt-3">
          <div className="flex-grow">
            <Label className="text-sm text-gray-500">Usuario</Label>
            <Label className="text-sm block">{user?.username}</Label>
          </div>
          <div className="text-end">
            <Label className="text-sm text-gray-500">Fecha de creación</Label>
            <Label className="text-sm block">11/07/2025</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default Details
