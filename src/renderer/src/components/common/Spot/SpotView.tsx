import { useSpotView } from "./useSpotView"
import SpotTable from "./SpotTable"
import { Card, CardContent, CardHeader, } from "../../ui/card"
import { ListIcon, Search, UsersIcon } from "lucide-react"
import { Input } from "../../ui/input"
//import { ScrollArea } from "../../ui/scroll-area"
import SpotForm from "./SpotForm"
import { PhaseType } from "@renderer/utils/types"

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
    handleSubmit
  } = useSpotView(phase)

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
                  <span className="text-sm font-medium text-foreground">Registros totales: {filteredAndSortedSpots.length}</span>
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
            <div className="relative flex items-center space-x-2 mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por carrera o localización..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
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
            />
          </CardContent>
        </Card>
        {/* </ScrollArea>*/}
      </div>
    </>
  )
}
export default SpotView
