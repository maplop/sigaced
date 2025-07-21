import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Plus } from "lucide-react"
import { Location } from "src/shared/types"


interface LocationFormProps {
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingLocation: Location | null,
  handleSubmit: (e: React.FormEvent) => void,
  formData: Omit<Location, 'id'>,
  setLocationFormData: React.Dispatch<React.SetStateAction<Omit<Location, 'id'>>>;
}

const LocationForm = ({ isDialogOpen, setIsDialogOpen, resetForm, editingLocation, handleSubmit, formData, setLocationFormData }: LocationFormProps) => {

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Localización
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingLocation ? "Editar Localización" : "Nueva Localización"}</DialogTitle>
          <DialogDescription>
            {editingLocation ? "Modifica los datos de la localización" : "Completa la información de la nueva localización"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            <Label htmlFor="location">Localización</Label>
            <Input
              id="location"
              name="location"
              placeholder="Escriba el nombre de la localización"
              value={formData.name}
              onChange={(e) => setLocationFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit">{editingLocation ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default LocationForm
