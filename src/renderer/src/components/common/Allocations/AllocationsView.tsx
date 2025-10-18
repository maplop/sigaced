import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Search, UsersIcon, Play, Trash2 } from "lucide-react";
import { useAllocations } from "./useAllocationsView";
import { PhaseType } from "@renderer/utils/types";
import { Button } from "@renderer/components/ui/button";
import AllocationsTable from "./AllocationsTable";
import { Progress } from "@renderer/components/ui/progress";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

interface AllocationsViewProps {
  phase: PhaseType
}

export default function AllocationsView({ phase }: AllocationsViewProps) {
  const {
    assignments,
    loadingAssignments,
    allocate,
    loadingStudents,
    loadingSpots,
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
    progress,
    handleDeleteAllFromPhase
  } = useAllocations(phase)
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex justify-between">
          <Card className="w-fit p-0 bg-transparent shadow-none">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Totales de asignaciones: {filteredAndSortedAssignments.length} </span>
            </div>
          </Card>
          <Button
            onClick={allocate}
          >
            <Play className="h-4 w-4" />
            Asignar
          </Button>
        </CardHeader>
        <CardContent>

          <div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Asignando...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full mb-3.5" />
          </div>

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
              title="Limpiar asignaciones de la fase"
              trigger={
                <Button className="text-red-500 hover:text-red-500" variant="outline" size="sm">
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
                  Esta acción también eliminará automáticamente cualquier <strong>asignación relacionada en fases posteriores</strong> que dependa de estas.
                </p>
                <p>
                  Esta operación <strong>no se puede deshacer</strong>.
                </p>
              </div>
            </ConfirmDeleteDialog>
          </div>


          {/* Tabla */}
          <AllocationsTable
            loadingAssignments={loadingAssignments}
            filteredAndSortedAssignments={filteredAndSortedAssignments}
            paginatedAssignments={paginatedAssignments}
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