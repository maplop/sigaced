export function resolveColumnWidths(
  columnWidths: (number | string)[],
  cols: number,
  tableWidth: number
): number[] {
  // Si no coincide el número de columnas, repartir equitativamente
  if (columnWidths.length !== cols) {
    return Array(cols).fill(tableWidth / cols)
  }

  // 1. Convertir % a px y detectar autos
  const parsed = columnWidths.map((w) => {
    if (typeof w === "string") {
      if (w === "auto") return "auto"

      if (w.endsWith("%")) {
        const percent = parseFloat(w)
        return (percent / 100) * tableWidth
      }
    }

    return Number(w) // px
  })

  // 2. Calcular espacio fijo (px + % convertidos)
  const fixedTotal = parsed.filter((w) => w !== "auto").reduce((acc, w) => acc + (w as number), 0)

  // 3. Contar autos
  const autoCount = parsed.filter((w) => w === "auto").length

  // Si no hay autos, devolver tal cual
  if (autoCount === 0) {
    return parsed as number[]
  }

  // 4. Espacio disponible para autos
  const remaining = tableWidth - fixedTotal
  const autoWidth = remaining / autoCount

  // 5. Construir widths finales
  return parsed.map((w) => (w === "auto" ? autoWidth : (w as number)))
}
