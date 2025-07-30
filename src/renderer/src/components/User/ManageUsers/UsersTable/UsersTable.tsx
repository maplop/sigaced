import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Button } from "@renderer/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@renderer/components/ui/badge"
import { Label } from "@renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { User } from "src/shared/types"
import SkeletonTable from "./SkeletonTable"
import { useAuthContext } from "@renderer/context/AuthContext"
import ConfirmDeleteDialog from "@renderer/components/common/ConfirmDeleteDialog"


export interface UsersTableProps {
  loadingUsers: boolean
  paginatedUsers: User[]
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  itemsPerPage: number,
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  sortField: keyof User | null
  sortDirection: "asc" | "desc"
  handleSort: (field: keyof User) => void
  handleEdit: (user: User) => void
  handleDelete: (id: string) => void
  filteredAndSortedUsers: User[]
}

const UsersTable = ({
  loadingUsers,
  paginatedUsers,
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
  filteredAndSortedUsers,
}: UsersTableProps) => {
  const { user: loggedUser } = useAuthContext()
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <>
      {!loadingUsers ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50">#</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                    Nombre {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("lastName")}>
                    Apellidos {sortField === "lastName" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("username")}>
                    Usuario {sortField === "username" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort("role")}>
                    Rol {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center cursor-pointer hover:bg-muted/50">
                    Fecha creación
                  </TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {filteredAndSortedUsers.length !== 0 ? (
                <TableBody>
                  {paginatedUsers.map((user, index) => {
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          {user.lastName}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Adminsitrador' : 'Supervisor'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{user.createdAt}</TableCell>
                        {user.id !== loggedUser?.id && (
                          <TableCell >
                            <div className="flex justify-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <ConfirmDeleteDialog
                                onConfirm={() => handleDelete(user.id)}
                                title="Eliminar usuario"
                                description={`¿Deseas eliminar al usuario "${user.username}"? Esta acción no se puede deshacer.`}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                }
                              />
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios.
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

export default UsersTable
