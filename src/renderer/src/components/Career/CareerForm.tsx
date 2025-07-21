import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Input } from "@renderer/components/ui/input"
import { Plus } from "lucide-react"
import { Career } from "src/shared/types"


interface CareerFormProps {
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void,
  editingCareer: Career | null,
  handleSubmit: (e: React.FormEvent) => void,
  formData: Omit<Career, 'id'>,
  setCareerFormData: React.Dispatch<React.SetStateAction<Omit<Career, 'id'>>>;
}

const CareerForm = ({ isDialogOpen, setIsDialogOpen, resetForm, editingCareer, handleSubmit, formData, setCareerFormData }: CareerFormProps) => {

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Carrera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCareer ? "Editar Carrera" : "Nueva Carrera"}</DialogTitle>
          <DialogDescription>
            {editingCareer ? "Modifica los datos de la carrera" : "Completa la información de la nueva carrera"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            <Label htmlFor="fullName">Carrera</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Escriba el nombre completo de la carrera"
              value={formData.fullName}
              onChange={(e) => setCareerFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2 py-4">
            <Label htmlFor="abbreviation">Abreviatura de la carrera</Label>
            <Input
              id="abbreviation"
              name="abbreviation"
              placeholder="Escriba el nombre abreviado de la carrera"
              value={formData.abbreviation}
              onChange={(e) => setCareerFormData((prev) => ({ ...prev, abbreviation: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2 py-4">
            <Label htmlFor="faculty">Facultad</Label>
            <Input
              id="faculty"
              name="faculty"
              placeholder="Escriba el nombre de la facultad"
              value={formData.faculty}
              onChange={(e) => setCareerFormData((prev) => ({ ...prev, faculty: e.target.value }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit">{editingCareer ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default CareerForm
