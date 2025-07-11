import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Button } from "@renderer/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Aspirante } from "../useApplicantsView"
import { Badge } from "@renderer/components/ui/badge"
import AverageBadge from "./AverageBadge"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"

export interface ApplicantsTableProps {
  paginatedAspirantes: Aspirante[]
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  sortField: keyof Aspirante | null
  sortDirection: "asc" | "desc"
  handleSort: (field: keyof Aspirante) => void
  handleEdit: (aspirante: Aspirante) => void
  handleDelete: (id: string) => void
  filteredAndSortedAspirantes: Aspirante[]
}

const ApplicantsTable = ({
  paginatedAspirantes,
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
}: ApplicantsTableProps) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
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
                Nombre y Apellidos {sortField === "lastName" && (sortDirection === "asc" ? "↑" : "↓")}
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
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAspirantes.map((aspirante, index) => (
              <TableRow key={aspirante.id}>
                <TableCell className="text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="text-center">{aspirante.ci}</TableCell>
                <TableCell className="font-medium">
                  {aspirante.lastName} {aspirante.name}
                </TableCell>
                <TableCell className="text-center">
                  <Badge>{aspirante.grade.toFixed(2)}</Badge>
                </TableCell>
                <TableCell className="text-center">{aspirante.age}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={aspirante.gender === 'F' ? 'secondary' : 'outline'}>
                    {aspirante.gender === 'F' ? 'Femenino' : 'Masculino'}
                  </Badge>
                </TableCell>
                <TableCell>{aspirante.municipality}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(aspirante)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(aspirante.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
  )
}

export default ApplicantsTable
