import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { useCareerView } from "./useCareerView"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../ui/card"
import { MapPin, Search } from "lucide-react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import CareerTable from "./CareerTable"
import CareerForm from "./CareerForm"

const CareerView = () => {
  const {
    paginatedCareers,
    loadingCareers,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedCareers,
    handleSort,
    isDialogOpen,
    setIsDialogOpen,
    editingCareer,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete
  } = useCareerView()

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageTitle title="Gestionar carreras" subtitle="Agrega, edita y organiza tus carreras  de forma rápida." />
        <CareerForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          resetForm={resetForm}
          editingCareer={editingCareer}
          formData={formData}
          setCareerFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Lista de Carreras</CardTitle>
              <CardDescription>Busca y gestiona todas las carreras registradas</CardDescription>
            </div>
            <Card className="w-fit p-3 bg-transparent shadow-none">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Total de carreras: {filteredAndSortedCareers.length}
                </span>
              </div>
            </Card>
          </CardHeader>
          <CardContent>
            <div className="relative flex items-center space-x-2 mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por carrera..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
            <CareerTable
              paginatedCareers={paginatedCareers}
              loadingCareers={loadingCareers}
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
              filteredAndSortedCareers={filteredAndSortedCareers}
            />
          </CardContent>
        </Card>
      </ScrollArea>
    </PageContainer>
  )
}
export default CareerView