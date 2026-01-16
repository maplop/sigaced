export interface PDFPayload {
  subtitle?: string
  table: (string | number | null)[][]
  columnWidths?: (number | string)[]
  columnAlignments?: ("left" | "center" | "right")[]
  saveName?: string
  outputDir?: string
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

export const createZip = async (sourceDir: string, zipName?: string): Promise<string> => {
  const response = await window.api.createZip(sourceDir, zipName)

  if (!response.success) {
    throw new Error(response.error || "Error al crear el archivo ZIP.")
  }

  if (!response.path) {
    throw new Error("No se recibió la ruta del ZIP generado.")
  }

  return response.path
}
