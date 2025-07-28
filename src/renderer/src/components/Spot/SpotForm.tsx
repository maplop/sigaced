import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Plus } from "lucide-react"
import { Career, Location, Spot } from "src/shared/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


interface SpotFormProps {
  careers?: Career[],
  loadingCareers: boolean,
  locations?: Location[],
  loadingLocations: boolean,
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingSpot: Spot | null,
  handleSubmit: (e: React.FormEvent) => void,
  formData: Omit<Spot, 'id'>,
  setSpotFormData: React.Dispatch<React.SetStateAction<Omit<Spot, 'id'>>>;
}

const SpotForm = ({ careers, loadingCareers, locations, loadingLocations, isDialogOpen, setIsDialogOpen, resetForm, editingSpot, handleSubmit, formData, setSpotFormData }: SpotFormProps) => {

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plaza
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingSpot ? "Editar Plaza" : "Nueva Plaza"}</DialogTitle>
          <DialogDescription>
            {editingSpot ? "Modifica los datos de la plaza" : "Completa la información de la nueva plaza"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            <Label htmlFor="careerId">Carrera</Label>
            <Select
              value={formData.careerId.toString()}
              onValueChange={(value) =>
                setSpotFormData((prev) => ({ ...prev, careerId: value }))
              }
            >
              <SelectTrigger id="careerId" className="w-full">
                <SelectValue placeholder={loadingCareers ? "Cargando carreras..." : "Seleccione una carrera"} />
              </SelectTrigger>
              <SelectContent>
                {loadingCareers ? (
                  <SelectItem disabled value="loading">Cargando carreras...</SelectItem>
                ) : careers && careers.length > 0 ? (
                  careers.map((career) => (
                    <SelectItem key={career.id} value={career.id.toString()}>
                      {career.abbreviation} — {career.fullName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-careers">No hay carreras registradas</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 py-4">
            <Label htmlFor="locationId">Localización</Label>
            <Select
              value={formData.locationId.toString()}
              onValueChange={(value) =>
                setSpotFormData((prev) => ({ ...prev, locationId: value }))
              }
            >
              <SelectTrigger id="locationId" className="w-full">
                <SelectValue placeholder={loadingLocations ? "Cargando localizaciones..." : "Seleccione una localización"} />
              </SelectTrigger>
              <SelectContent>
                {loadingLocations ? (
                  <SelectItem disabled value="loading">Cargando localizaciones...</SelectItem>
                ) : locations && locations.length > 0 ? (
                  locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-locations">No hay localizaciones registradas</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="w-32 space-y-2 py-4">
            <Label htmlFor="availableQuantity">Plazas disponibles</Label>
            <Input
              id="availableQuantity"
              name="availableQuantity"
              type="number"
              placeholder="Escriba la cantidad de plazas disponibles"
              value={formData.availableQuantity}
              onChange={(e) => setSpotFormData((prev) => ({ ...prev, availableQuantity: Number(e.target.value) }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit">{editingSpot ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default SpotForm
