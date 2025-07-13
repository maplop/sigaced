import {
  Table, TableBody, TableHead, TableRow, TableHeader, TableCell
} from "@renderer/components/ui/table"
import { Skeleton } from "@renderer/components/ui/skeleton"

const SkeletonTable = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center cursor-pointer hover:bg-muted/50">#</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" >
                Nombre
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50">
                Apellidos
              </TableHead>
              <TableHead className="text-center cursor-pointer hover:bg-muted/50">
                Usuario
              </TableHead>
              <TableHead className="text-center cursor-pointer hover:bg-muted/50">
                Rol
              </TableHead>
              <TableHead className="text-center cursor-pointer hover:bg-muted/50">
                Fecha creación
              </TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }, (_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[180px]" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default SkeletonTable
