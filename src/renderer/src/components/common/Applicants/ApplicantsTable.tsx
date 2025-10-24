import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Button } from "@renderer/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@renderer/components/ui/badge"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { SpotFull, Student } from "src/shared/types"
import ConfirmDeleteDialog from "../ConfirmDeleteDialog"
import { ApplicantsRequestsModal } from "./ApplicantsRequestsModal"
import { useQuery } from "@tanstack/react-query"
import { rqKeys } from "@renderer/utils/rqKeys"
import { getAssignmentsByPhase } from "@renderer/api/assignment"

type SortableField = keyof Student | "requestsCount"

export interface ApplicantsTableProps {
  loadingStudents: boolean,
  filteredAndSortedSpots: Student[]
  paginatedStudents: Student[]
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  sortField: SortableField | null
  sortDirection: "asc" | "desc"
  handleSort: (field: SortableField) => void
  handleEdit: (student: Student) => void
  handleDeleteStudent: (studentId: number) => void
  filteredAndSortedStudents: Student[],
  spots: SpotFull[],
  loadingSpots: boolean,
  phaseId?: number
}

const ApplicantsTable = ({
  loadingStudents,
  filteredAndSortedSpots,
  paginatedStudents,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  sortField,
  sortDirection,
  handleSort,
  handleDeleteStudent,
  handleEdit,
  spots,
  loadingSpots,
  phaseId
}: ApplicantsTableProps) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: [rqKeys.ASSIGNMENTS, 3],
    queryFn: () => getAssignmentsByPhase(3)
  })

  return (
    <>
      {!loadingStudents ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50">#</TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("ci")}>
                    CI {sortField === "ci" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("lastName")}>
                    Apellidos {sortField === "lastName" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                    Nombre  {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("grade")}>
                    Nota {sortField === "grade" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("age")}>
                    Edad {sortField === "age" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("gender")}>
                    Sexo {sortField === "gender" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("municipality")}>
                    Municipio {sortField === "municipality" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  {phaseId === 3 && (
                    <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("requestsCount")}>
                      Estado {sortField === "municipality" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                  )}
                  {phaseId !== 3 && (
                    <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("requestsCount")}>
                      Solicitudes {sortField === "municipality" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                  )}
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {filteredAndSortedSpots.length !== 0 ? (
                <TableBody>
                  {paginatedStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center">{student.ci}</TableCell>
                      <TableCell className="font-medium">
                        {student.lastName}
                      </TableCell>
                      <TableCell>
                        {student.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge>{student.grade.toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{student.age}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={student.gender === 'F' ? 'secondary' : 'outline'}>
                          {student.gender === 'F' ? 'Femenino' : 'Masculino'}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.municipality}</TableCell>
                      {phaseId === 3 && (
                        <TableCell className="text-center">
                          {loadingAssignments
                            ? "Cargando..."
                            : assignments?.some(a => a.ci === student.ci)
                              ? <Badge className="bg-green-100 text-green-700 font-bold">Asignado</Badge>
                              : <Badge className="bg-yellow-100 text-yellow-700 font-bold">Pendiente</Badge>}
                        </TableCell>
                      )}
                      {phaseId !== 3 && (
                        <TableCell className="text-center font-medium">
                          {(() => {
                            const requestsCount = student.requests?.length ?? 0;

                            if (requestsCount > 0) {
                              return (
                                <div className="flex justify-center items-center gap-2">
                                  <span>{requestsCount}</span>
                                  <ApplicantsRequestsModal student={student} spots={spots ?? []} loadingSpots={loadingSpots} />
                                </div>
                              );
                            }
                            return <span className="text-red-700">{requestsCount}</span>;
                          })()}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <ConfirmDeleteDialog
                            onConfirm={() => handleDeleteStudent(student.id)}
                            title="Eliminar aspirante"
                            trigger={
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            }
                          >
                            <div className="space-y-2 text-center">
                              <p>
                                ¿Deseas eliminar al aspirante <strong>{student.name} {student.lastName}</strong> con CI <strong>{student.ci}</strong>?
                              </p>
                              <p>Esta acción solo eliminará al aspirante de la fase actual y se eliminarán todas las solicitudes relacionadas con este aspirante en esta fase. Esta acción no se puede deshacer.</p>
                            </div>
                          </ConfirmDeleteDialog>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron aspirantes.
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center space-x-3">
              <Button variant={currentPage === 1 ? 'outline' : 'default'} size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </Button>
              <Label className="text-sm">Página {currentPage} de {totalPages}</Label>
              <Button variant={currentPage === totalPages ? 'outline' : 'default'} size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Siguiente
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Label htmlFor="items-per-page">Mostrar:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-sm">por página</Label>
            </div>
          </div>
        </div>
      ) : (
        <div>Cargando...</div>
      )}

    </>

  )
}

export default ApplicantsTable
