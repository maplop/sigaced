import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Button } from "@renderer/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { SpotFull } from "src/shared/types"
import SkeletonTable from "./SkeletonTable"
import ConfirmDeleteDialog from "@renderer/components/common/ConfirmDeleteDialog"
import { Badge } from "../../ui/badge"


export interface SpotsTableProps {
  loadingSpots: boolean
  paginatedSpots: SpotFull[]
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  sortField: keyof SpotFull | null
  sortDirection: "asc" | "desc"
  handleSort: (field: keyof SpotFull) => void
  handleEdit: (spot: SpotFull) => void
  handleDelete: (id: number) => void
  filteredAndSortedSpots: SpotFull[]
}

const SpotsTable = ({
  loadingSpots,
  paginatedSpots,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  sortField,
  sortDirection,
  handleSort,
  handleDelete,
  handleEdit,
  filteredAndSortedSpots
}: SpotsTableProps) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <>
      {!loadingSpots ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50">#</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("careerName")}>
                    Carrera {sortField === "careerName" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("locationName")}>
                    Localización {sortField === "locationName" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("availableQuantity")}>
                    Plazas Disponibles {sortField === 'availableQuantity' && (sortDirection === 'asc' ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="flex justify-end items-center mr-12">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {filteredAndSortedSpots.length !== 0 ? (
                <TableBody>
                  {paginatedSpots.map((spot, index) => {
                    return (
                      <TableRow key={spot.spotId}>
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{spot.careerName}</TableCell>
                        <TableCell>{spot.locationName}</TableCell>
                        <TableCell className="text-center"><Badge>{spot.availableQuantity}</Badge></TableCell>
                        <TableCell >
                          <div className="flex justify-end items-center mr-8 space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(spot)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <ConfirmDeleteDialog
                              onConfirm={() => handleDelete(spot.spotId)}
                              title="Eliminar plaza"
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              }
                            >
                              <div className="space-y-2 text-center">
                                <p>¿Deseas eliminar la plaza <strong>{spot.careerName} - {spot.locationName}</strong>?</p>
                                <p>Esta acción no se puede deshacer.</p>
                              </div>
                            </ConfirmDeleteDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron plazas.
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
        </div >
      ) : (
        <SkeletonTable />
      )}
    </>

  )
}

export default SpotsTable
