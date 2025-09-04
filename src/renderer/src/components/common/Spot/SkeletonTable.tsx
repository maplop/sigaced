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
              <TableHead className="cursor-pointer hover:bg-muted/50">
                Carrera
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50">
                Localización
              </TableHead>
              <TableHead className="text-center cursor-pointer hover:bg-muted/50">
                Plazas Disponibles
              </TableHead>
              <TableHead className="text-center cursor-pointer hover:bg-muted/50">
                Fase
              </TableHead>
              <TableHead className="flex justify-end items-center mr-12">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }, (_, i) => (
              <TableRow key={i}>
                <TableCell className="flex justify-center text-center">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell className="flex justify-center items-center">
                  <Skeleton className="h-6 w-6" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
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
