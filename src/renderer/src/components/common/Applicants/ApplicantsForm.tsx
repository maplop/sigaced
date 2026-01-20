import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@renderer/components/ui/radio-group"
import { SpotFull, Applicant } from "src/shared/types"
import { Separator } from "@renderer/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@renderer/components/ui/command"
import { useState } from "react"
import { cn } from "@renderer/lib/utils"

interface ApplicantsFormProps {
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingApplicant: Applicant | null,
  handleSubmit: (e: React.FormEvent) => void,
  addRequest: () => void
  updateRequest: (index: number, spotId: number) => void
  removeRequest: (index: number) => void
  formData: Omit<Applicant, 'id'>,
  setFormData: React.Dispatch<React.SetStateAction<Omit<Applicant, 'id'>>>;
  spots: SpotFull[],
  loadingSpots: boolean,
  phaseId?: number
}

const ApplicantsForm = ({
  isDialogOpen,
  setIsDialogOpen,
  resetForm,
  editingApplicant,
  handleSubmit,
  addRequest,
  updateRequest,
  removeRequest,
  formData,
  setFormData,
  spots,
  loadingSpots,
  phaseId
}: ApplicantsFormProps) => {

  const [openRequests, setOpenRequests] = useState<{ [key: number]: boolean }>({})

  const handleOpenChangeRequest = (index: number) => (isOpen: boolean) => {
    setOpenRequests(prev => ({ ...prev, [index]: isOpen }))
  }

  const [openMunicipality, setOpenMunicipality] = useState(false)


  const municipalitiesList = [
    "Caibarién",
    "Camajuaní",
    "Cifuentes",
    "Corralillo",
    "Encrucijada",
    "Manicaragua",
    "Placetas",
    "Quemado de Güines",
    "Ranchuelo",
    "Remedios",
    "Sagua la Grande",
    "Santa Clara",
    "Santo Domingo"
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Aspirante
        </Button>
      </DialogTrigger>
      <DialogContent className={phaseId === 3 ? "w-auto" : "sm:max-w-[825px]"}>
        <DialogHeader>
          <DialogTitle>{editingApplicant ? "Editar Aspirante" : "Nuevo Aspirante"}</DialogTitle>
          <DialogDescription>
            {editingApplicant ? "Modifica los datos del aspirante" : "Completa la información del nuevo aspirante"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 h-[312px]">
            <div className="grid gap-4 py-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ci">CI</Label>
                  <Input
                    id="ci"
                    value={formData.ci}
                    required
                    maxLength={11}
                    minLength={11}
                    placeholder="Ingrese el CI"
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 11);
                      setFormData((prev) => ({ ...prev, ci: onlyNumbers }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Nota</Label>
                  <Input
                    id="grade"
                    type="number"
                    step="0.01"
                    min={60}
                    max={100}
                    value={formData.grade}
                    onChange={(e) => setFormData((prev) => ({ ...prev, grade: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="municipality">Municipio</Label>
                  <Popover open={openMunicipality} onOpenChange={setOpenMunicipality}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMunicipality}
                        className="w-full justify-between font-normal"
                      >
                        {formData.municipality || "Seleccione un municipio"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-[375px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar municipio..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No se encontró ningún municipio.</CommandEmpty>
                          <CommandGroup>
                            {municipalitiesList.map((municipality) => (
                              <CommandItem
                                key={municipality}
                                value={municipality}
                                onSelect={() => {
                                  setFormData((prev) => ({ ...prev, municipality }));
                                  setOpenMunicipality(false);
                                }}
                              >
                                {municipality}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    formData.municipality === municipality ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="col-span-2 border rounded-lg p-2">
                  <div className="text-sm font-medium mb-4">Género</div>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gender: value as "M" | "F" }))
                    }
                    className="flex flex-row gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="M" id="masculino" />
                      <Label htmlFor="masculino" className="cursor-pointer">
                        Masculino
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="F" id="femenino" />
                      <Label htmlFor="femenino" className="cursor-pointer">
                        Femenino
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {phaseId !== 3 && (
              <>
                <Separator orientation="vertical" className="h-full" />

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[18px] font-bold">Solicitudes</Label>
                    {(formData.requests?.length || 0) < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRequest}
                        className="h-6 w-6 p-0 bg-transparent"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {formData.requests?.map((request, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label>Opción {index + 1}</Label>
                          {(formData.requests?.length || 0) > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRequest(index)}
                              className="h-4 w-4 p-2 text-muted-foreground hover:text-[#0F172B]"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <Popover open={!!openRequests[index]} onOpenChange={handleOpenChangeRequest(index)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={!!openRequests[index]}
                              className="w-full justify-between font-normal"
                            >
                              {request.spotId
                                ? (() => {
                                  const spot = spots?.find(s => s.spotId === request.spotId)
                                  return spot ? `${spot.careerName} - ${spot.locationName}` : "Seleccione una plaza..."
                                })()
                                : loadingSpots
                                  ? "Cargando plazas..."
                                  : "Seleccione una plaza"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="min-w-[379px] p-0">
                            <Command>
                              <CommandInput placeholder="Buscar plaza..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No se encontró ninguna plaza.</CommandEmpty>
                                <CommandGroup>
                                  {loadingSpots ? (
                                    <CommandItem disabled>Cargando plazas...</CommandItem>
                                  ) : (
                                    spots?.map((spot) => (
                                      <CommandItem
                                        key={spot.spotId}
                                        value={`${spot.careerName} - ${spot.locationName}`}
                                        onSelect={() => {
                                          updateRequest(index, spot.spotId)
                                          setOpenRequests(prev => ({ ...prev, [index]: false }))
                                        }}
                                      >
                                        {spot.careerName} - {spot.locationName}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            request.spotId === spot.spotId ? "opacity-100" : "opacity-0"
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
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit">{editingApplicant ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default ApplicantsForm