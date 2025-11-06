export const formatDate = (fecha: Date) => {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
  ]

  const d = fecha.getDate()
  const m = meses[fecha.getMonth()]
  const y = fecha.getFullYear()

  return `${d} ${m} ${y}`
}
