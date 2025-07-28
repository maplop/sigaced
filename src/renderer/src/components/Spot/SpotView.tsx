import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { useSpotView } from "./useSpotView"
import SpotsTable from "./SpotsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../ui/card"
import { MapPin, Search } from "lucide-react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import SpotForm from "./SpotForm"
import SpotStatistics from "./SpotStatistics"

const SpotView = () => {

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
    careerMap,
    locations,
    loadingLocations,
    locationMap,
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
  } = useSpotView()

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageTitle title="Gestionar plazas" subtitle="Agrega, edita y organiza tus plazas  de forma rápida." />
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

      </div>
      <ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">
        <div className="flex flex-col gap-6">
          <SpotStatistics />
          <Card>
            <CardHeader className="flex justify-between">
              <div>
                <CardTitle>Lista de Plazas</CardTitle>
                <CardDescription>Busca y gestiona todas las plazas registradas</CardDescription>
              </div>
              <Card className="w-fit p-3 bg-transparent shadow-none">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Total de plazas:
                  </span>
                </div>
              </Card>
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
              <SpotsTable
                careerMap={careerMap}
                locationMap={locationMap}
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
              />
              {filteredAndSortedSpots.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron plazas.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </PageContainer>
  )
}
export default SpotView
