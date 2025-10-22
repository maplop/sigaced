import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@renderer/components/ui/dialog"
import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { Play } from "lucide-react"
import { SpotFull, Student } from "src/shared/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"

interface ApplicantsFormProps {
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  students: Student[],
  loadingStudents: boolean,
  spots: SpotFull[],
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
            <Select
              value={formData.studentId?.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, studentId: Number(value) }))
              }
              required
            >
              <SelectTrigger id="studentId" className="w-full">
                <SelectValue placeholder={loadingStudents ? "Cargando aspirantes..." : "Seleccione un aspirante"} />
              </SelectTrigger>
              <SelectContent>
                {loadingStudents ? (
                  <SelectItem disabled value="loading">Cargando aspirantes...</SelectItem>
                ) : students && students.length > 0 ? (
                  students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()} className="block">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          {student.lastName} {student.name}
                        </div>
                        <Badge>{student.grade.toFixed(2)}</Badge>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-locations">No hay aspirantes registrados</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 py-4">
            <Label htmlFor="spotId">Plazas</Label>
            <Select
              value={formData.spotId?.toString() ?? ''}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, spotId: Number(value) }))
              }
              required
            >
              <SelectTrigger id="spotId" className="w-full">
                <SelectValue placeholder={loadingSpots ? "Cargando plazas..." : "Seleccione una plaza"} />
              </SelectTrigger>
              <SelectContent>
                {loadingSpots ? (
                  <SelectItem disabled value="loading">Cargando plazas...</SelectItem>
                ) : spots && spots.length > 0 ? (
                  spots.map((spot) => (
                    <SelectItem key={spot.spotId} value={spot.spotId.toString()}>
                      {spot.careerName} - {spot.locationName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-locations">No hay plazas registradas</SelectItem>
                )}
              </SelectContent>
            </Select>
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
