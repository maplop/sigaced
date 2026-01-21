import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Search, UsersIcon, Play, Trash2, FileText } from "lucide-react";
import { useAllocations } from "./useAllocationsView";
import { PhaseType } from "@renderer/utils/types";
import { Button } from "@renderer/components/ui/button";
import AllocationsTable from "./AllocationsTable";
import { Progress } from "@renderer/components/ui/progress";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { useAuthContext } from "@renderer/context/AuthContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface AllocationsViewProps {
  phase: PhaseType
}

export default function AllocationsView({ phase }: AllocationsViewProps) {
  const {
    loadingAllocations,
    allocate,
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
    progress,
    handleDeleteAllFromPhase,
    isAllocated,
    showAlert,
    setShowAlert,
    applicantsWithoutRequests,
    handleExportPDF
  } = useAllocations(phase)

  const { user } = useAuthContext()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex justify-between">
          <div className="w-fit p-0 bg-transparent shadow-none">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Total de otorgamientos: {filteredAndSortedAllocations.length} </span>
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
              <>
                <Button
                  onClick={() => {
                    if (user.role === 'admin') {
                      allocate()
                    }
                  }}
                  disabled={filteredAndSortedAllocations.length > 0}
                >
                  <Play className="h-4 w-4" />
                  Otorgar
                </Button>

                <ConfirmDeleteDialog
                  open={showAlert}
                  onOpenChange={setShowAlert}
                  onConfirm={() => setShowAlert(false)}
                  title="Otorgamiento no permitido"
                  confirmText="Entendido"
                >
                  {applicantsWithoutRequests.length === 1
                    ? "Hay 1 aspirante sin solicitudes registradas."
                    : `Hay ${applicantsWithoutRequests.length} aspirantes sin solicitudes registradas.`}

                  <br /><br />

                  <p className="text-center text-sm text-muted-foreground">
                    Cada aspirante debe tener al menos una solicitud registrada para poder
                    proceder con el otorgamiento de plazas.
                    Por favor, revisa los datos antes de continuar.
                  </p>
                </ConfirmDeleteDialog>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isAllocated && (
            <div className="mb-3.5">
              <div className="flex justify-between items-center text-muted-foreground mb-1">
                <span>Otorgando...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

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
                }}
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
                    ¿Estás seguro de que deseas eliminar <strong>todos los otorgamientos</strong> de esta fase?
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
          />
        </CardContent>
      </Card>
    </div>
  )
}