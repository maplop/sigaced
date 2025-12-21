import PageContainer from "../common/PageContainer"
import PageTitle from "../common/PageTitle"
import { useCareerView } from "./useCareerView"
import { Card, CardContent, CardHeader, } from "../ui/card"
import { FileText, GraduationCap, Search, Trash2 } from "lucide-react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import CareerTable from "./CareerTable"
import CareerForm from "./CareerForm"
import ConfirmDeleteDialog from "../common/ConfirmDeleteDialog"
import { Button } from "../ui/button"
import { useAuthContext } from "@renderer/context/AuthContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

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
    handleDelete,
    handleDeleteAll,
    handleExportPDF
  } = useCareerView()

  const { user } = useAuthContext()




  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageTitle title="Gestionar carreras" subtitle="Agrega, edita y organiza tus carreras  de forma rápida." />

      </div>
      <ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="w-fit p-0 bg-transparent shadow-none">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Total de carreras: {filteredAndSortedCareers.length}
                </span>
              </div>
            </div>
            <CareerForm
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              resetForm={resetForm}
              editingCareer={editingCareer}
              formData={formData}
              setCareerFormData={setFormData}
              handleSubmit={handleSubmit}
            />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex items-center space-x-2 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por carrera..."
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
                        handleDeleteAll()
                      }
                    }}
                    title="Limpiar tabla"
                    trigger={
                      <Button className="text-red-500 hover:text-red-500" variant="outline" size="sm" disabled={filteredAndSortedCareers.length === 0}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        Limpiar Tabla
                      </Button>
                    }
                  >
                    <div className="space-y-2 text-center">
                      <div className="space-y-2 text-center">
                        <p>
                          ¿Seguro que deseas eliminar <strong>todas las carreras </strong> del sistema?
                        </p>
                        <p>
                          Esta acción también eliminará las <strong>plazas asociadas a dichas carreras </strong>
                          en todas las fases.
                        </p>
                        <p>
                          Esta operación no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </ConfirmDeleteDialog>
                )}
              </div>

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