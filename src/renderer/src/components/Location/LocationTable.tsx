import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Button } from "@renderer/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { Location } from "src/shared/types"
import SkeletonTable from "./SkeletonTable"
import ConfirmDeleteDialog from "@renderer/components/common/ConfirmDeleteDialog"


export interface LocationsTableProps {
  loadingLocations: boolean
  paginatedLocations: Location[]
  filteredAndSortedLocations: Location[]
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  sortField: keyof Location | null
  sortDirection: "asc" | "desc"
  handleSort: (field: keyof Location) => void
  handleEdit: (location: Location) => void
  handleDelete: (id: string) => void
}

const LocationsTable = ({
  loadingLocations,
  paginatedLocations,
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
  filteredAndSortedLocations
}: LocationsTableProps) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <>
      {!loadingLocations ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50">#</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                    Ubicación {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="flex justify-end items-center mr-12">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {filteredAndSortedLocations.length !== 0 ? (
                <TableBody>
                  {paginatedLocations.map((location, index) => {
                    return (
                      <TableRow key={location.id}>
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{location.name}</TableCell>
                        <TableCell >
                          <div className="flex justify-end items-center mr-8 space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(location)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <ConfirmDeleteDialog
                              onConfirm={() => handleDelete(location.id)}
                              title="Eliminar ubicación"
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              }
                            >
                              <div className="space-y-2 text-center">
                                <p>¿Deseas eliminar la ubicación <strong>{location.name}</strong>?</p>
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
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No se encontraron ubicaciones.
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
                disabled={filteredAndSortedLocations.length === 0 || currentPage === 1}
              >
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
                disabled={filteredAndSortedLocations.length === 0 || currentPage === totalPages}
              >
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

export default LocationsTable
