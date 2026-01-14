import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Search, UsersIcon, Trash2, FileText } from "lucide-react";
import { useManualAllocationView } from "./useManualAllocationView";
import { PhaseType } from "@renderer/utils/types";
import { Button } from "@renderer/components/ui/button";
import AllocationsTable from "../common/Allocations/AllocationsTable";
import ConfirmDeleteDialog from "../common/ConfirmDeleteDialog";
import AddManualAllocation from "./AddManualAllocation";
import { useAuthContext } from "@renderer/context/AuthContext";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface AllocationsViewProps {
  phase: PhaseType
}

export default function ManualAllocationView({ phase }: AllocationsViewProps) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    paginatedAllocations,
    filteredAndSortedAllocations,
    loadingAllocations,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    sortField,
    handleSort,
    sortDirection,
    handleDeleteAllFromPhase,
    unallocatedApplicants,
    loadingApplicants,
    availableSpots,
    loadingSpots,
    formData,
    setFormData,
    handleSubmit,
    resetForm,
    handleExportPDF
  } = useManualAllocationView(phase)

  const { user } = useAuthContext()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex justify-between">
          <div className="w-fit p-0 bg-transparent shadow-none">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Total de otorgamientos: {paginatedAllocations.length}  </span>
            </div>
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
              <AddManualAllocation
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                applicants={unallocatedApplicants ?? []}
                loadingApplicants={loadingApplicants}
                spots={availableSpots ?? []}
                loadingSpots={loadingSpots}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
              />
            )}
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
            {user?.role === 'admin' && (
              <ConfirmDeleteDialog
                onConfirm={() => {
                  if (user.role === 'admin') {
                    handleDeleteAllFromPhase()
                  }
                }
                }
                title="Limpiar otorgamientos de la fase"
                trigger={
                  <Button className="text-red-500 hover:text-red-500" variant="outline" size="sm" disabled={filteredAndSortedAllocations.length === 0}>
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
            )}
          </div>

          {/* Tabla */}
          <AllocationsTable
            loadingAllocations={loadingAllocations}
            filteredAndSortedAllocations={filteredAndSortedAllocations}
            paginatedAllocations={paginatedAllocations}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            phaseId={phase}
          />
        </CardContent>
      </Card>
    </div >
  )
}
