import { Button } from "@renderer/components/ui/button"
import { Loader } from "lucide-react"
import { useFormStatus } from "react-dom"

const RegisterButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader className="animate-spin" />}
      Crear Cuenta
    </Button >
  )
}
export default RegisterButton
