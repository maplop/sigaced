export function getAlignedTextX(
  alignment: "left" | "center" | "right",
  x: number,
  cellWidth: number,
  textWidth: number,
  padding: number = 4
) {
  switch (alignment) {
    case "left":
      return x + padding
    case "right":
      return x + cellWidth - textWidth - padding
    case "center":
    default:
      return x + (cellWidth - textWidth) / 2
  }
}
