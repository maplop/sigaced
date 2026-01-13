import { useEffect, useState } from "react"

/**
 * Hook personalizado para aplicar debounce a un valor
 * @param value - El valor a aplicar debounce
 * @param delay - El tiempo de espera en milisegundos (por defecto 500ms)
 * @returns El valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
