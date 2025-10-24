import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Plus, X } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@renderer/components/ui/radio-group"
import { SpotFull, Student } from "src/shared/types"
import { Separator } from "@renderer/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"

interface ApplicantsFormProps {
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingStudent: Student | null,
  handleSubmit: (e: React.FormEvent) => void,
  addRequest: () => void
  updateRequest: (index: number, spotId: number) => void
  removeRequest: (index: number) => void
  formData: Omit<Student, 'id'>,
  setFormData: React.Dispatch<React.SetStateAction<Omit<Student, 'id'>>>;
  spots: SpotFull[],
  loadingSpots: boolean,
  phaseId?: number
}

const ApplicantsForm = ({
  isDialogOpen,
  setIsDialogOpen,
  resetForm,
  editingStudent,
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
          <DialogTitle>{editingStudent ? "Editar Aspirante" : "Nuevo Aspirante"}</DialogTitle>
          <DialogDescription>
            {editingStudent ? "Modifica los datos del aspirante" : "Completa la información del nuevo aspirante"}
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
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
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
                    min="60"
                    max="100"
                    value={formData.grade}
                    onChange={(e) => setFormData((prev) => ({ ...prev, grade: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    step="1"
                    min="18"
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipality">Municipio</Label>
                  <Input
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => setFormData((prev) => ({ ...prev, municipality: e.target.value }))}
                    required
                  />
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
                        <Select
                          value={request.spotId ? String(request.spotId) : ""}
                          onValueChange={(value) => updateRequest(index, parseInt(value))}
                        >
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue placeholder="Seleccionar carrera" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingSpots ? (
                              <SelectItem value="0">Cargando...</SelectItem>
                            ) : (
                              spots.map((spot) => (
                                <SelectItem
                                  key={spot.spotId}
                                  value={String(spot.spotId)}
                                >
                                  {spot.careerName} - {spot.locationName}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
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
            <Button type="submit">{editingStudent ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default ApplicantsForm