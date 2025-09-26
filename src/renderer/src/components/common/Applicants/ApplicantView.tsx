import { Search, UsersIcon } from "lucide-react"
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
    handleDeleteFromPhase,
    addRequest,
    updateRequest,
    removeRequest,
    resetForm
  } = useApplicantsView(phase)

  const { data: spots, isLoading: loadingSpots } = useQuery({
    queryKey: [rqKeys.SPOT, phase],
    queryFn: () => getAllSpots(phase)
  })


  return (
    <div className="flex flex-col gap-4">


      {/*<ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">*/}
      <Card>
        <CardHeader className="flex justify-between">
          <Card className="w-fit p-0 bg-transparent shadow-none">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Totales de aspirantes: {filteredAndSortedStudents.length}</span>
            </div>
          </Card>
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
          />
        </CardHeader>
        <CardContent>
          <div className="relative flex items-center space-x-2 mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre y apellidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-sm"
            />
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
            handleDeleteFromPhase={handleDeleteFromPhase}
            handleEdit={handleEdit}
            filteredAndSortedStudents={filteredAndSortedStudents}
            spots={spots ?? []}
            loadingSpots={loadingSpots}
          />
        </CardContent>
      </Card>
      {/*</ScrollArea>*/}
    </div>
  )
}
