import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { useLocationView } from "./useLocationView"
import LocationsTable from "./LocationTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../ui/card"
import { MapPin, Search } from "lucide-react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import LocationForm from "./LocationForm"

const LocationView = () => {
  const {
    paginatedLocations,
    loadingLocations,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedLocations,
    handleSort,
    isDialogOpen,
    setIsDialogOpen,
    editingLocation,
    formData,
    setFormData,
    resetForm,
    handleEdit,
    handleDelete,
    handleSubmit
  } = useLocationView()
  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageTitle title="Gestionar localizaciones" subtitle="Agrega, edita y organiza tus localizaciones  de forma rápida." />
        <LocationForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          resetForm={resetForm}
          editingLocation={editingLocation}
          formData={formData}
          setLocationFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Lista de Localizaciones</CardTitle>
              <CardDescription>Busca y gestiona todos las localizaciones registradas</CardDescription>
            </div>
            <Card className="w-fit p-3 bg-transparent shadow-none">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Total de localizaciones: {paginatedLocations.length}
                </span>
              </div>
            </Card>
          </CardHeader>
          <CardContent>
            <div className="relative flex items-center space-x-2 mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
            <LocationsTable
              paginatedLocations={paginatedLocations}
              loadingLocations={loadingLocations}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
              sortField={sortField}
              sortDirection={sortDirection}
              filteredAndSortedLocations={filteredAndSortedLocations}
              handleSort={handleSort}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
            {filteredAndSortedLocations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron localizaciones.
              </div>
            )}
          </CardContent>
        </Card>
      </ScrollArea>
    </PageContainer>
  )
}
export default LocationView