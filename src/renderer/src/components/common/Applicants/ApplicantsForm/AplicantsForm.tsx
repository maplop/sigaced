import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Plus } from "lucide-react"
import { Aspirante, FormData } from "../../common/Applicants/useApplicantsView"
import { RadioGroup, RadioGroupItem } from "@renderer/components/ui/radio-group"

interface ApplicantsFormProps {
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingAspirante: Aspirante | null,
  handleSubmit: (e: React.FormEvent) => void,
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const ApplicantsForm = ({ isDialogOpen, setIsDialogOpen, resetForm, editingAspirante, handleSubmit, formData, setFormData }: ApplicantsFormProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Aspirante
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingAspirante ? "Editar Aspirante" : "Nuevo Aspirante"}</DialogTitle>
          <DialogDescription>
            {editingAspirante ? "Modifica los datos del aspirante" : "Completa la información del nuevo aspirante"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ci">CI</Label>
                <Input
                  id="ci"
                  value={formData.ci}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ci: e.target.value }))}
                  required
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
                  step="0.1"
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
              <div className="space-x-2">
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value as "M" | "F" }))
                  }
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="M" id="r2" />
                    <Label htmlFor="r2">Masculino</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="F" id="r3" />
                    <Label htmlFor="r3">Femenino</Label>
                  </div>
                </RadioGroup>
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
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit">{editingAspirante ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default ApplicantsForm