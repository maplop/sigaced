import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Button } from "@renderer/components/ui/button"
import { Badge } from "@renderer/components/ui/badge"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { AllocationRow } from "src/shared/types"
import { getBadgePhaseName } from "@renderer/utils/getBadgePhaseName"


export interface AllocationsTableProps {
  loadingAllocations: boolean,
  filteredAndSortedAllocations: AllocationRow[]
  paginatedAllocations: AllocationRow[]
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  sortField: keyof AllocationRow | null
  sortDirection: "asc" | "desc"
  handleSort: (field: keyof AllocationRow) => void
}

const FinalListTable = ({
  loadingAllocations,
  filteredAndSortedAllocations,
  paginatedAllocations,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  sortField,
  sortDirection,
  handleSort
}: AllocationsTableProps) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <>
      {!loadingAllocations ? (
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
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("career")}>
                    Carrera {sortField === "career" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("location")}>
                    Ubicación {sortField === "location" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("grade")}>
                    Nota {sortField === "grade" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("phase")}>
                    Fase del Otorgamiento{sortField === "preferenceOrder" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("preferenceOrder")}>
                    Preferencia Otorgada {sortField === "preferenceOrder" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              {filteredAndSortedAllocations.length !== 0 ? (
                <TableBody>
                  {paginatedAllocations.map((allocation, index) => (
                    <TableRow key={allocation.id}>
                      <TableCell className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center">{allocation.ci}</TableCell>
                      <TableCell className="font-medium">
                        {allocation.lastName}
                      </TableCell>
                      <TableCell >
                        {allocation.name}
                      </TableCell>
                      <TableCell >
                        {allocation.career}
                      </TableCell>
                      <TableCell >
                        {allocation.location}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge>{allocation.grade.toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {getBadgePhaseName(allocation.phase)}
                      </TableCell>
                      <TableCell className="text-center font-medium">{allocation.preferenceOrder}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron otorgamientos.
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
                disabled={filteredAndSortedAllocations.length === 0 || currentPage === 1}>
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
                disabled={filteredAndSortedAllocations.length === 0 || currentPage === totalPages}>
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
        <div>Cargando otorgamientos...</div>
      )}

    </>

  )
}

export default FinalListTable