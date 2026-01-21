import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Button } from "@renderer/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@renderer/components/ui/badge"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { SpotFull, Applicant } from "src/shared/types"
import ConfirmDeleteDialog from "../ConfirmDeleteDialog"
import { ApplicantsRequestsModal } from "./ApplicantsRequestsModal"
import { useQuery } from "@tanstack/react-query"
import { rqKeys } from "@renderer/utils/rqKeys"
import { getAllocationsByPhase } from "@renderer/api/allocation"

type SortableField = keyof Applicant | "requestsCount"

export interface ApplicantsTableProps {
  loadingApplicants: boolean,
  filteredAndSortedApplicants: Applicant[]
  paginatedApplicants: Applicant[]
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  sortField: SortableField | null
  sortDirection: "asc" | "desc"
  handleSort: (field: SortableField) => void
  handleEdit: (applicant: Applicant) => void
  handleDeleteApplicant: (applicantId: number) => void
  spots: SpotFull[],
  loadingSpots: boolean,
  phaseId?: number
}

const ApplicantsTable = ({
  loadingApplicants,
  filteredAndSortedApplicants,
  paginatedApplicants,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  sortField,
  sortDirection,
  handleSort,
  handleDeleteApplicant,
  handleEdit,
  spots,
  loadingSpots,
  phaseId
}: ApplicantsTableProps) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const { data: allocations, isLoading: loadingAllocations } = useQuery({
    queryKey: [rqKeys.ALLOCATIONS, 3],
    queryFn: () => getAllocationsByPhase(3)
  })

  return (
    <>
      {!loadingApplicants ? (
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
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("gender")}>
                    Sexo {sortField === "gender" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("municipality")}>
                    Municipio {sortField === "municipality" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  {phaseId === 3 && (
                    <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("requestsCount")}>
                      Estado {sortField === "requestsCount" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                  )}
                  {phaseId !== 3 && (
                    <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("requestsCount")}>
                      Solicitudes {sortField === "requestsCount" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                  )}
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {filteredAndSortedApplicants.length !== 0 ? (
                <TableBody>
                  {paginatedApplicants.map((applicant, index) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center">{applicant.ci}</TableCell>
                      <TableCell className="font-medium">
                        {applicant.lastName}
                      </TableCell>
                      <TableCell>
                        {applicant.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge>{applicant.grade.toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={applicant.gender === 'F' ? 'secondary' : 'outline'}>
                          {applicant.gender === 'F' ? 'Femenino' : 'Masculino'}
                        </Badge>
                      </TableCell>
                      <TableCell>{applicant.municipality}</TableCell>
                      {phaseId === 3 && (
                        <TableCell className="text-center">
                          {loadingAllocations
                            ? "Cargando..."
                            : allocations?.some(a => a.ci === applicant.ci)
                              ? <Badge className="bg-green-100 text-green-700 font-bold">Otorgado</Badge>
                              : <Badge className="bg-yellow-100 text-yellow-700 font-bold">Pendiente</Badge>}
                        </TableCell>
                      )}
                      {phaseId !== 3 && (
                        <TableCell className="text-center font-medium">
                          {(() => {
                            const requestsCount = applicant.requests?.length ?? 0;

                            if (requestsCount > 0) {
                              return (
                                <div className="flex justify-center items-center gap-2">
                                  <span>{requestsCount}</span>
                                  <ApplicantsRequestsModal applicant={applicant} spots={spots ?? []} loadingSpots={loadingSpots} />
                                </div>
                              );
                            }
                            return <span className="text-red-700">{requestsCount}</span>;
                          })()}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(applicant)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <ConfirmDeleteDialog
                            onConfirm={() => handleDeleteApplicant(applicant.id)}
                            title="Eliminar aspirante"
                            trigger={
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            }
                          >
                            <div className="space-y-2 text-center">
                              <p>
                                ¿Deseas eliminar al aspirante <strong>{applicant.name} {applicant.lastName}</strong> con CI <strong>{applicant.ci}</strong>?
                              </p>
                              <p>Esta acción eliminará definitivamente al aspirante del sistema en todas las fases, así como sus solicitudes y otorgamientos. No se puede deshacer.</p>
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
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={filteredAndSortedApplicants.length === 0 || currentPage === 1}>
                Anterior
              </Button>
              {totalPages === 0 ? (
                <Label className="text-sm opacity-30">No hay páginas</Label>
              ) : (
                <Label className="text-sm">Página {currentPage} de {totalPages}</Label>
              )}
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={filteredAndSortedApplicants.length === 0 || currentPage === totalPages}>
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
