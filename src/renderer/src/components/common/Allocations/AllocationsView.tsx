import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Search, UsersIcon, Play } from "lucide-react";
import { useAllocations } from "./useAllocationsView";
import { PhaseType } from "@renderer/utils/types";
import { Button } from "@renderer/components/ui/button";
import AllocationsTable from "./AllocationsTable";
import { Progress } from "@renderer/components/ui/progress";

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
    progress
  } = useAllocations(phase)
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex justify-between">
          <Card className="w-fit p-0 bg-transparent shadow-none">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Totales de aspirantes: {filteredAndSortedAssignments.length} </span>
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
          <Progress value={progress} className="w-full mb-3.5" />

          <div className="relative flex items-center space-x-2 mb-4">

            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por: (ci, nombre, apellidos, carrera, lugar)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-sm"
            />
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