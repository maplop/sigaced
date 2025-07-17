import PageContainer from "@renderer/components/common/PageContainer"
import PageTitle from "@renderer/components/common/PageTitle"
import UsersTable from "./UsersTable/UsersTable"
import UserForm from "./UserForm/UserForm"
import { useManageUsersView } from "./useManageUsersView"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@renderer/components/ui/input"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import UsersStatistics from "./UsersStatistics"

const ManageUsersView = () => {
  const {
    changePassword,
    setChangePassword,
    loadingUsers,
    paginatedUsers,
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
    editingUser,
    formData,
    setUserFormData,
    filteredAndSortedUsers,
    handleSort,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  } = useManageUsersView()
  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageTitle title="Gestionar usuarios" subtitle="Panel de control para la administración de usuarios." />
        <UserForm
          changePassword={changePassword}
          setChangePassword={setChangePassword}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          resetForm={resetForm}
          editingUser={editingUser}
          handleSubmit={handleSubmit}
          formData={formData}
          setUserFormData={setUserFormData}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-212px)] rounded-md pr-3.5">
        <div className="flex flex-col gap-6">
          <UsersStatistics
            users={paginatedUsers}
          />
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>Busca y gestiona todos los usuarios registrados</CardDescription>
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
              <UsersTable
                loadingUsers={loadingUsers}
                paginatedUsers={paginatedUsers}
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
                filteredAndSortedUsers={filteredAndSortedUsers}
              />

              {filteredAndSortedUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron usuarios que coincidan con la búsqueda.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </PageContainer>
  )
}
export default ManageUsersView
