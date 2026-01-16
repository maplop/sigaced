import AdmZip from "adm-zip"
import fs from "fs"
import path from "path"
import { app } from "electron"
import { getUniqueFilePath } from "./getUniqueFilePath"

/**
 * Crea un archivo ZIP con todos los archivos PDF de un directorio
 * @param sourceDir Directorio que contiene los PDFs
 * @param zipName Nombre del archivo ZIP (sin extensión)
 * @returns Ruta del archivo ZIP creado
 */
export async function createZipFromDirectory(
  sourceDir: string,
  zipName: string = "Aspirantes por Carrera"
): Promise<string> {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`El directorio ${sourceDir} no existe`)
  }

  // Leer todos los archivos PDF del directorio
  const files = fs.readdirSync(sourceDir)
  const pdfFiles = files.filter((file) => file.toLowerCase().endsWith(".pdf"))

  if (pdfFiles.length === 0) {
    throw new Error("No se encontraron archivos PDF en el directorio")
  }

  // Crear instancia de ZIP
  const zip = new AdmZip()

  // Agregar cada PDF al ZIP
  for (const pdfFile of pdfFiles) {
    const filePath = path.join(sourceDir, pdfFile)
    zip.addLocalFile(filePath, "", pdfFile)
  }

  // Guardar el ZIP en Documents
  const outputPath = path.join(app.getPath("documents"), `${zipName}.zip`)
  const uniqueOutputPath = getUniqueFilePath(outputPath)

  // Guardar el ZIP
  zip.writeZip(uniqueOutputPath)

  return uniqueOutputPath
}
