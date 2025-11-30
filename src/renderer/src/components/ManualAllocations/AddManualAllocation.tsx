import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Check, ChevronsUpDown, Play } from "lucide-react"
import { SpotFull, Student } from "src/shared/types"
import { Badge } from "../ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { useState } from "react"
import { cn } from "@renderer/lib/utils"

type SpotWithAvailable = SpotFull & { availableQuantityReal: number }


interface ApplicantsFormProps {
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  students: Student[],
  loadingStudents: boolean,
  spots: SpotWithAvailable[],
  loadingSpots: boolean,
  resetForm: () => void,
  handleSubmit: (e: React.FormEvent) => void,
  formData: {
    studentId: number | null
    spotId: number | null
  },
  setFormData: React.Dispatch<React.SetStateAction<{
    studentId: number | null
    spotId: number | null
  }>>;
}

const AddManualAllocation = ({
  isDialogOpen,
  setIsDialogOpen,
  students,
  loadingStudents,
  spots,
  loadingSpots,
  handleSubmit,
  formData,
  setFormData,
  resetForm
}: ApplicantsFormProps) => {

  const [open, setOpen] = useState({ applicant: false, spot: false })

  const handleOpenChange = (key: "applicant" | "spot") => (isOpen: boolean) => {
    setOpen((prev) => ({ ...prev, [key]: isOpen }))
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Play className="h-4 w-4" />
          Otorgar Manualmente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Otorgamiento Manual de Plazas</DialogTitle>
          <DialogDescription>
            Asigna manualmente un estudiante a una de las plazas disponible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            <Label htmlFor="studentId">Aspirantes</Label>
            <Popover open={open.applicant} onOpenChange={handleOpenChange('applicant')}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open.applicant}
                  className="w-full justify-between font-normal"
                >
                  {formData.studentId
                    ? (() => {
                      const student = students?.find(s => s.id === formData.studentId)
                      return student ? (
                        <div className="flex justify-between items-center w-full">
                          <div>{student.lastName} {student.name}</div>
                          <Badge>{student.grade.toFixed(2)}</Badge>
                        </div>
                      ) : "Seleccione un aspirante..."
                    })()
                    : loadingStudents
                      ? "Cargando aspirantes..."
                      : "Seleccione un aspirante"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[462px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar aspirante..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró ningún aspirante.</CommandEmpty>
                    <CommandGroup>
                      {loadingStudents ? (
                        <CommandItem disabled>Cargando aspirantes...</CommandItem>
                      ) : (
                        students?.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={`${student.lastName} ${student.name}`}
                            onSelect={() => {
                              setFormData((prev) => ({ ...prev, studentId: student.id }))
                              setOpen((prev) => ({ ...prev, applicant: false }))
                            }}
                          >
                            <div className="flex justify-between items-center w-full">
                              <div>{student.lastName} {student.name}</div>
                              <Badge>{student.grade.toFixed(2)}</Badge>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                formData.studentId === student.id ? "opacity-100" : "opacity-0"
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
            <Label htmlFor="spotId">Plazas</Label>
            <Popover open={open.spot} onOpenChange={handleOpenChange('spot')}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open.spot}
                  className="w-full justify-between font-normal"
                >
                  {formData.spotId
                    ? (() => {
                      const spot = spots?.find(s => s.spotId === formData.spotId)
                      return spot ? (
                        <div className="flex justify-between items-center w-full">
                          <div>{spot.careerName} en {spot.locationName}</div>
                          <Badge>{spot.availableQuantityReal}</Badge>
                        </div>
                      ) : "Seleccione una plaza..."
                    })()
                    : loadingSpots
                      ? "Cargando plazas..."
                      : "Seleccione una plaza"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[462px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar plaza..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró ningna plaza.</CommandEmpty>
                    <CommandGroup>
                      {loadingSpots ? (
                        <CommandItem disabled>Cargando plazas...</CommandItem>
                      ) : (
                        spots?.map((spot) => (
                          <CommandItem
                            key={spot.spotId}
                            value={`${spot.careerName} en ${spot.locationName}`}
                            onSelect={() => {
                              setFormData((prev) => ({ ...prev, spotId: spot.spotId }))
                              setOpen((prev) => ({ ...prev, spot: false }))
                            }}
                          >
                            <div className="flex justify-between items-center w-full">
                              <div>{spot.careerName} en {spot.locationName}</div>
                              <Badge>{spot.availableQuantityReal}</Badge>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                formData.spotId === spot.spotId ? "opacity-100" : "opacity-0"
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => resetForm()}>
              Cancelar
            </Button>
            <Button type="submit">Otorgar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default AddManualAllocation
