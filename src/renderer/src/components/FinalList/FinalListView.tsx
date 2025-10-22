import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { useFinalList } from "./useFinalList"
import FinalListTable from "./FinalListTable"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Search, Trash2, UsersIcon } from "lucide-react"
import ConfirmDeleteDialog from "../common/ConfirmDeleteDialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const FinalListView = () => {
  const {
    loadingAssignments,
    paginatedAssignments,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedAssignments,
    handleSort,
    handleDeleteAllFromPhase
  } = useFinalList()
  return (
    <PageContainer>
      <PageTitle
        title={'Listado Final del Otorgamiento'}
        subtitle={'Aquí se muestran todos los estudiantes asignados en los diferentes otorgamientos.'} />
      <div className="w-full">
        <Card>
          <CardHeader>
            <div className="w-fit p-0 bg-transparent shadow-none">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Total de asignaciones: {filteredAndSortedAssignments.length} </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex items-center space-x-2 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por: (ci, nombre, apellidos, carrera, lugar)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-sm"
                />
              </div>
              <ConfirmDeleteDialog
                onConfirm={() => handleDeleteAllFromPhase()}
                title="Limpiar otorgamientos de la fase"
                trigger={
                  <Button className="text-red-500 hover:text-red-500" variant="outline" size="sm" disabled={filteredAndSortedAssignments.length === 0}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    Deshacer otorgamiento
                  </Button>
                }
              >
                <div className="space-y-2 text-center">
                  <p>
                    ¿Estás seguro de que deseas eliminar <strong>todas las asignaciones</strong> de esta fase?
                  </p>
                  <p>
                    Esta acción también eliminará automáticamente cualquier <strong>otorgamientorelacionada en fases posteriores</strong> que dependa de estas.
                  </p>
                  <p>
                    Esta operación <strong>no se puede deshacer</strong>.
                  </p>
                </div>
              </ConfirmDeleteDialog>
            </div>
            <FinalListTable
              loadingAssignments={loadingAssignments}
              filteredAndSortedAssignments={filteredAndSortedAssignments}
              paginatedAssignments={paginatedAssignments}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
export default FinalListView
