import { useSpotView } from "./useSpotView"
import SpotTable from "./SpotTable"
import { Card, CardContent, CardHeader, } from "../../ui/card"
import { FileText, ListIcon, Search, Trash2, UsersIcon } from "lucide-react"
import { Input } from "../../ui/input"
//import { ScrollArea } from "../../ui/scroll-area"
import SpotForm from "./SpotForm"
import { PhaseType } from "@renderer/utils/types"
import ConfirmDeleteDialog from "../ConfirmDeleteDialog"
import { Button } from "@renderer/components/ui/button"
import { useAuthContext } from "@renderer/context/AuthContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"

interface SpotViewProps {
  phase: PhaseType
}

const SpotView = ({ phase }: SpotViewProps) => {

  const {
    paginatedSpots,
    loadingSpots,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    careers,
    loadingCareers,
    locations,
    loadingLocations,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedSpots,
    handleSort,
    isDialogOpen,
    setIsDialogOpen,
    editingSpot,
    formData,
    setFormData,
    resetForm,
    handleEdit,
    handleDelete,
    handleDeleteAllFromPhase,
    handleSubmit,
    handleExportPDF
  } = useSpotView(phase)

  const { user } = useAuthContext()

  const totalAvailableSpots = filteredAndSortedSpots.reduce(
    (total, spot) => total + spot.availableQuantity,
    0
  )

  return (
    <>
      <div className="flex flex-col gap-4">
        {/*<ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">*/}
        <Card>
          <CardHeader className="flex justify-between">
            <Card className="w-fit p-0 bg-transparent shadow-none">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ListIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Total de registros: {filteredAndSortedSpots.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Plazas disponibles: {totalAvailableSpots}</span>
                </div>
              </div>
            </Card>
            <SpotForm
              careers={careers}
              loadingCareers={loadingCareers}
              locations={locations}
              loadingLocations={loadingLocations}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              resetForm={resetForm}
              editingSpot={editingSpot}
              formData={formData}
              setSpotFormData={setFormData}
              handleSubmit={handleSubmit}
            />

          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex items-center space-x-2 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por carrera o ubicación..."
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
                      <Button className="text-red-500 hover:text-red-500" variant="outline" size="sm" disabled={filteredAndSortedSpots.length === 0}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        Limpiar Tabla
                      </Button>
                    }
                  >
                    <div className="space-y-2 text-center">
                      <p>
                        ¿Seguro que deseas eliminar <strong>todas las plazas</strong> de esta fase?
                      </p>
                      <p>
                        Esta operación no se puede deshacer.
                      </p>
                    </div>
                  </ConfirmDeleteDialog>
                )}
              </div>
            </div>
            <SpotTable
              paginatedSpots={paginatedSpots}
              loadingSpots={loadingSpots}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              filteredAndSortedSpots={filteredAndSortedSpots}
              phaseId={phase}
            />
          </CardContent>
        </Card>
        {/* </ScrollArea>*/}
      </div>
    </>
  )
}
export default SpotView
