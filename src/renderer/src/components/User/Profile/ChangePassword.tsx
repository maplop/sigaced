import { Button } from "@renderer/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent } from "@renderer/components/ui/card"
import { Input } from "@renderer/components/ui/input"
import { Label } from "@renderer/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isValid, setIsValid] = useState(false)
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {
      newPassword: '',
      confirmPassword: ''
    }

    // Validar que la nueva contraseña no sea igual a la actual
    if (formData.newPassword && formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'La nueva contraseña no puede ser igual a la actual'
    }

    // Validar que las contraseñas coincidan
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)

    // Verificar si el formulario es válido
    const allFieldsFilled = Object.values(formData).every(field => field.trim() !== '')
    const noErrors = Object.values(newErrors).every(error => error === '')

    setIsValid(allFieldsFilled && noErrors)
  }

  useEffect(() => {
    validateForm()
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Contraseña cambiada:', formData)
    // Resetear el formulario después del envío
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <div className="relative">
              <Input
                id="current-password"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña actual"
                className="pr-10"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="new-password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Escribe tu nueva contraseña"
                className="pr-10"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Confirma tu nueva contraseña"
                className="pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-[var(--errorMessage)]">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="absolute bottom-6 right-6">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!isValid}
            >
              Cambiar contraseña
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePassword
