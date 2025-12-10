import { Avatar, AvatarFallback } from "@renderer/components/ui/avatar"
import { Card, CardHeader, CardContent } from "@renderer/components/ui/card"
import { Label } from "@renderer/components/ui/label"
import { Badge } from "@renderer/components/ui/badge"
import { useAuthContext } from "@renderer/context/AuthContext"
import { Button } from "@renderer/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteUser } from "@renderer/api/user"
import { toast } from "sonner"
import ConfirmDeleteDialog from "@renderer/components/common/ConfirmDeleteDialog"

const Details = () => {
  const { user, logout } = useAuthContext()

  const handleDeleteUser = async () => {
    try {
      const userId = user?.id
      if (userId) {
        await deleteUser(userId)
        toast.success("Su cuenta ha sido eliminada correctamente.")
        logout()
      } else {
        toast.error("Ha ocurrido un error, no se encuentra el usuario a eliminar.", {
          style: {
            color: 'var(--errorMessage)'
          }
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Ha ocurrido un error al intentar eliminar el usuario.", {
        style: {
          color: 'var(--errorMessage)'
        }
      })
    }
  }

  return (
    <Card className="w-full relative overflow-hidden">
      <div className="absolute top-0 w-full h-[100px] bg-[var(--primary)]" />
      <CardHeader>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="w-20 h-20 border-3 border-white bg-white">
          <AvatarFallback>
            {user?.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Label className="text-[18px] my-2">{user?.name} {user?.lastName}</Label>
        <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>{user?.role === 'admin' ? 'Administrador' : 'Supervisor'}</Badge>
        <div className="flex justify-between w-full mt-3">
          <div className="grow">
            <Label className="text-sm text-gray-500">Usuario</Label>
            <Label className="text-sm block">{user?.username}</Label>
          </div>
          <div className="text-end">
            <Label className="text-sm text-gray-500">Fecha de creación</Label>
            <Label className="text-sm block">{user?.createdAt}</Label>
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-5 flex justify-center items-center w-full ">
        <ConfirmDeleteDialog
          onConfirm={handleDeleteUser}
          title="Eliminar cuenta"
          trigger={
            <Button className="bg-red-100 text-[var(--errorMessage)] hover:bg-red-200">
              <Trash2 className="w-4 h-4" />
              Eliminar cuenta
            </Button>
          }
        >
          <div className="space-y-2 text-center">
            <p>¿Deseas eliminar su cuenta?</p>
            <p>Esta acción no se puede deshacer.</p>
          </div>
        </ConfirmDeleteDialog>
      </div>
    </Card >
  )
}
export default Details
