export interface PDFPayload {
  subtitle?: string
  table: (string | number)[][]
  columnWidths?: (number | string)[]
  columnAlignments?: ("left" | "center" | "right")[]
  saveName?: string
}

export const exportPDF = async (payload: PDFPayload): Promise<string> => {
  const response = await window.api.generatePDF(payload)

  if (!response.success) {
    throw new Error(response.error || "Error al generar el PDF.")
  }

  if (!response.path) {
    throw new Error("No se recibió la ruta del PDF generado.")
  }

  return response.path
}
