import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Career, Location, Spot, SpotFull } from "src/shared/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@renderer/components/ui/dialog"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@renderer/components/ui/command"
import { cn } from "@renderer/lib/utils"

interface SpotFormProps {
  careers?: Career[],
  loadingCareers: boolean,
  locations?: Location[],
  loadingLocations: boolean,
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingSpot: SpotFull | null,
  handleSubmit: (e: React.FormEvent) => void,
  formData: Omit<Spot, 'id' | 'phaseId'>,
  setSpotFormData: React.Dispatch<React.SetStateAction<Omit<Spot, 'id'>>>;
}

const SpotForm = ({ careers, loadingCareers, locations, loadingLocations, isDialogOpen, setIsDialogOpen, resetForm, editingSpot, handleSubmit, formData, setSpotFormData }: SpotFormProps) => {


  const isFormComplete =
    formData.careerId !== undefined &&
    formData.locationId !== undefined &&
    formData.availableQuantity !== undefined &&
    !isNaN(formData.availableQuantity) &&
    formData.availableQuantity >= 0

  const [open, setOpen] = useState({ career: false, location: false })

  const handleOpenChange = (key: "career" | "location") => (isOpen: boolean) => {
    setOpen((prev) => ({ ...prev, [key]: isOpen }))
  }

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
            <Popover open={open.career} onOpenChange={handleOpenChange('career')}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open.career}
                  className="w-full justify-between"
                >
                  {formData.careerId
                    ? careers?.find((career) => career.id === formData.careerId)?.fullName
                    : loadingCareers
                      ? "Cargando carreras..."
                      : "Seleccione una carrera"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[375px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar carrera..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró ninguna carrera.</CommandEmpty>
                    <CommandGroup>
                      {loadingCareers ? (
                        <CommandItem disabled>Cargando carreras...</CommandItem>
                      ) : (
                        careers?.map((career) => (
                          <CommandItem
                            key={career.id}
                            value={career.fullName}
                            onSelect={() => {
                              setSpotFormData((prev) => ({ ...prev, careerId: career.id }))
                              setOpen((prev) => ({ ...prev, career: false }))
                            }}
                          >
                            {career.fullName}
                            <Check
                              className={cn(
                                "ml-auto",
                                formData.careerId === career.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 py-4">
            <Label htmlFor="locationId">Localización</Label>
            <Popover open={open.location} onOpenChange={handleOpenChange('location')}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open.location}
                  className="w-full justify-between"
                >
                  {formData.locationId
                    ? locations?.find((location) => location.id === formData.locationId)?.name
                    : loadingLocations
                      ? "Cargando localizaciones..."
                      : "Seleccione una localización"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[375px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar localización..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró ninguna localización.</CommandEmpty>
                    <CommandGroup>
                      {loadingLocations ? (
                        <CommandItem disabled>Cargando localizaciones...</CommandItem>
                      ) : (
                        locations?.map((location) => (
                          <CommandItem
                            key={location.id}
                            value={location.name}
                            onSelect={() => {
                              setSpotFormData((prev) => ({ ...prev, locationId: location.id }))
                              setOpen((prev) => ({ ...prev, location: false }))
                            }}
                          >
                            {location.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                formData.locationId === location.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-32 space-y-2 py-4">
            <Label htmlFor="availableQuantity">Plazas disponibles</Label>
            <Input
              id="availableQuantity"
              name="availableQuantity"
              type="number"
              min={0}
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
            <Button type="submit" disabled={!isFormComplete}>
              {editingSpot ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default SpotForm
