import { Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { ScrollArea } from "../../ui/scroll-area"

import PageContainer from "../PageContainer"
import PageTitle from "../PageTitle"
import ApplicantsTable from "./ApplicantsTable/ApplicantsTable"
import ApplicantsForm from "./ApplicantsForm/AplicantsForm"
import ApplicantsStatistics from "./ApplicantsStatistics/ApplicantsStatistics"
import { useApplicantsView } from "./useApplicantsView"



export default function ApplicantsView() {

  const {
    paginatedAspirantes,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    isDialogOpen,
    setIsDialogOpen,
    editingAspirante,
    formData,
    setFormData,
    filteredAndSortedAspirantes,
    handleSort,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  } = useApplicantsView()

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle title="Gestión de Aspirantes" subtitle="Administra los aspirantes a carreras universitarias" />
        <ApplicantsForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          resetForm={resetForm}
          editingAspirante={editingAspirante}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">
        <div className="flex flex-col gap-6">
          {/* Estadísticas */}
          <ApplicantsStatistics />

          {/* Buscador */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Aspirantes</CardTitle>
              <CardDescription>Busca y gestiona todos los aspirantes registrados</CardDescription>
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

              {/* Tabla */}
              <ApplicantsTable
                paginatedAspirantes={paginatedAspirantes}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                filteredAndSortedAspirantes={filteredAndSortedAspirantes}
              />

              {filteredAndSortedAspirantes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron aspirantes que coincidan con la búsqueda.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </PageContainer>
  )
}
