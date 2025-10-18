import { TriangleAlert } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog"

interface ConfirmDeleteDialogProps {
  trigger: React.ReactNode
  onConfirm: () => void
  title?: string
  confirmText?: string,
  children: React.ReactNode
}

const ConfirmDeleteDialog = ({
  trigger,
  onConfirm,
  title = "¿Estás seguro?",
  children,
  confirmText = "Eliminar"
}: ConfirmDeleteDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="flex justify-center items-center w-20 h-20 rounded-full bg-red-100 mb-2">
            <TriangleAlert className="h-12 w-12 text-[var(--errorMessage)]" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-[var(--errorMessage)] hover:bg-red-500" onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDeleteDialog
