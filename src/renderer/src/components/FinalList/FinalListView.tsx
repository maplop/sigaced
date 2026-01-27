import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { useFinalList } from "./useFinalList"
import FinalListTable from "./FinalListTable"
import { Card, CardContent, CardHeader } from "../ui/card"
import { FileText, Search, Trash2, UsersIcon } from "lucide-react"
import ConfirmDeleteDialog from "../common/ConfirmDeleteDialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAuthContext } from "@renderer/context/AuthContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ScrollArea } from "../ui/scroll-area"

const FinalListView = () => {
  const {
    loadingAllocations,
    paginatedAllocations,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedAllocations,
    handleSort,
    handleDeleteAllFromPhase,
    handleExportPDF
  } = useFinalList()

  const { user } = useAuthContext()

  return (
    <PageContainer>
      <PageTitle
        title={"Listado Final del Otorgamiento"}
        subtitle={
          "Aquí se muestran todos los aspirantes otorgados en los diferentes otorgamientos."
        }
      />
      <div className="w-full">
        <ScrollArea className="h-[calc(100vh-212px)] rounded-md">
          <Card>
            <CardHeader>
              <div className="w-fit p-0 bg-transparent shadow-none">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {loadingAllocations
                      ? "Cargando otorgamientos..."
                      : `Total de otorgamientos: ${filteredAndSortedAllocations.length}`}
                  </span>
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
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="w-8 h-8 flex justify-center items-center bg-[#F1F5F9] rounded-sm cursor-pointer"
                        onClick={() => handleExportPDF()}
                      >
                        <FileText size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exportar listado a PDF</p>
                    </TooltipContent>
                  </Tooltip>
                  {user?.role === "admin" && (
                    <ConfirmDeleteDialog
                      onConfirm={() => {
                        if (user.role === "admin") {
                          handleDeleteAllFromPhase()
                        }
                      }}
                      title="Limpiar todos los otorgamientos"
                      trigger={
                        <Button
                          className="text-red-500 hover:text-red-500"
                          variant="outline"
                          size="sm"
                          disabled={filteredAndSortedAllocations.length === 0}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          Deshacer otorgamiento
                        </Button>
                      }
                    >
                      <div className="space-y-2 text-center">
                        <p>
                          ¿Estás seguro de que deseas eliminar{" "}
                          <strong>todos los otorgamientos</strong>?
                        </p>
                        <p>
                          Esta acción eliminará todos los otorgamientos registrados en el sistema.
                        </p>
                        <p>
                          Esta operación <strong>no se puede deshacer</strong>.
                        </p>
                      </div>
                    </ConfirmDeleteDialog>
                  )}
                </div>
              </div>
              <FinalListTable
                loadingAllocations={loadingAllocations}
                filteredAndSortedAllocations={filteredAndSortedAllocations}
                paginatedAllocations={paginatedAllocations}
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
        </ScrollArea>
      </div>
    </PageContainer>
  )
}
export default FinalListView
