import { FileText, Search, Trash2, UsersIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "../../ui/card"
import { Input } from "../../ui/input"
//import { ScrollArea } from "../../ui/scroll-area"
import ApplicantsTable from "./ApplicantsTable"
import ApplicantsForm from "./ApplicantsForm"
import { useApplicantsView } from "./useApplicantsView"
import { PhaseType } from "@renderer/utils/types"
import { rqKeys } from "@renderer/utils/rqKeys"
import { useQuery } from "@tanstack/react-query"
import { getAllSpots } from "@renderer/api/spot"
import ConfirmDeleteDialog from "../ConfirmDeleteDialog"
import { Button } from "@renderer/components/ui/button"
import { useAuthContext } from "@renderer/context/AuthContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"


interface ApplicantsViewProps {
  phase: PhaseType
}


export default function ApplicantsView({ phase }: ApplicantsViewProps) {

  const {
    paginatedStudents,
    loadingStudents,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    isDialogOpen,
    setIsDialogOpen,
    editingStudent,
    formData,
    setFormData,
    filteredAndSortedStudents,
    handleSort,
    handleSubmit,
    handleEdit,
    handleDeleteStudent,
    handleDeleteAllFromPhase,
    addRequest,
    updateRequest,
    removeRequest,
    resetForm,
    handleExportPDF
  } = useApplicantsView(phase)

  const { user } = useAuthContext()

  const { data: spots, isLoading: loadingSpots } = useQuery({
    queryKey: [rqKeys.SPOT, phase],
    queryFn: () => getAllSpots(phase)
  })


  return (
    <div className="flex flex-col gap-4">


      {/*<ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">*/}
      <Card>
        <CardHeader className="flex justify-between">
          <div className="w-fit p-0 bg-transparent shadow-none">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Total de aspirantes: {filteredAndSortedStudents.length}</span>
            </div>
          </div>
          <ApplicantsForm
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            resetForm={resetForm}
            editingStudent={editingStudent}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            addRequest={addRequest}
            updateRequest={updateRequest}
            removeRequest={removeRequest}
            spots={spots || []}
            loadingSpots={loadingSpots}
            phaseId={phase}
          />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex items-center space-x-2 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre y apellidos..."
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
              {user?.role === 'admin' && (
                <ConfirmDeleteDialog
                  onConfirm={() => {
                    if (user?.role === 'admin') {
                      handleDeleteAllFromPhase()
                    }
                  }}
                  title="Limpiar tabla"
                  trigger={
                    <Button className="text-red-500 hover:text-red-500" variant="outline" size="sm" disabled={filteredAndSortedStudents.length === 0}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                      Limpiar Tabla
                    </Button>
                  }
                >
                  <div className="space-y-2 text-center">
                    <div className="space-y-2 text-center">
                      <p>
                        ¿Seguro que deseas eliminar <strong>todos los aspirantes</strong> de esta fase?
                      </p>
                      <p>
                        Esta acción también eliminará los <strong>registros asociados en fases posteriores</strong>
                        de los mismos aspirantes.
                      </p>
                      <p>Esta operación no se puede deshacer.</p>
                    </div>
                  </div>
                </ConfirmDeleteDialog>
              )}
            </div>
          </div>

          {/* Tabla */}
          <ApplicantsTable
            loadingStudents={loadingStudents}
            filteredAndSortedSpots={filteredAndSortedStudents}
            paginatedStudents={paginatedStudents}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleDeleteStudent={handleDeleteStudent}
            handleEdit={handleEdit}
            filteredAndSortedStudents={filteredAndSortedStudents}
            spots={spots ?? []}
            loadingSpots={loadingSpots}
            phaseId={phase}
          />
        </CardContent>
      </Card>
      {/*</ScrollArea>*/}
    </div>
  )
}
