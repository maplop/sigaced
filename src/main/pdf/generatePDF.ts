import { PDFDocument, RGB, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"
import { app } from "electron"
import { getUniqueFilePath } from "./getUniqueFilePath"
import { rgb255 } from "./rgb255"
import { resolveColumnWidths } from "./resolveColumnWidths"
import { headerPDF } from "./headerPDF"
import { getAlignedTextX } from "./getAlignedTextX"

type PDFTable = (string | number | null)[][]

interface GeneratePDFPayload {
  subtitle?: string
  table: PDFTable
  columnWidths?: (number | string)[]
  columnAlignments?: ("left" | "center" | "right")[]
  saveName?: string
}

export async function generatePDF({
  subtitle = "",
  table,
  columnWidths = [],
  columnAlignments = [],
  saveName = "documento.pdf"
}: GeneratePDFPayload) {
  const MARGIN = 50
  const PAGE_WIDTH = 595
  const PAGE_HEIGHT = 842
  const TABLE_WIDTH = PAGE_WIDTH - 2 * MARGIN

  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Header y subtítulo SOLO en la primera página
  let y = await headerPDF({ page, pdfDoc, startY: PAGE_HEIGHT - MARGIN, marginLeft: MARGIN })

  if (subtitle) {
    page.drawText(subtitle, {
      x: MARGIN,
      y: y - 40,
      size: 14,
      font,
      color: rgb(0.1, 0.1, 0.1)
    })
  }

  y -= 70

  // ---------------------------
  // TABLA GENÉRICA CON SALTO DE PÁGINA
  // ---------------------------
  if (table.length > 0) {
    const cols = table[0].length
    const widths = resolveColumnWidths(columnWidths, cols, TABLE_WIDTH)

    for (let rowIndex = 0; rowIndex < table.length; rowIndex++) {
      const row = table[rowIndex]
      const cellHeight = 16
      let x = MARGIN

      // Salto de página
      if (y - cellHeight < MARGIN) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = PAGE_HEIGHT - MARGIN // reiniciar Y arriba de la nueva página
      }

      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex]
        const isHeader = rowIndex === 0
        const cellWidth = widths[colIndex]

        let backgroundColor: RGB | undefined
        if (isHeader) {
          backgroundColor = rgb255(2, 6, 24)
        } else {
          backgroundColor = rowIndex % 2 === 0 ? rgb255(240, 240, 240) : undefined
        }

        page.drawRectangle({
          x,
          y,
          width: cellWidth,
          height: cellHeight,
          color: backgroundColor
        })

        const text = String(cell)
        const fontSize = 7
        const textWidth = font.widthOfTextAtSize(text, fontSize)

        // 👇 toma la alineación de la columna, si no está definida usa "left"
        const alignment = columnAlignments?.[colIndex] || "left"

        const textX = getAlignedTextX(alignment, x, cellWidth, textWidth)
        const textY = y + (cellHeight - fontSize) / 2 + 2

        page.drawText(text, {
          x: textX,
          y: textY,
          size: fontSize,
          font,
          color: isHeader ? rgb255(255, 255, 255) : rgb255(0, 0, 0)
        })

        x += cellWidth
      }

      y -= cellHeight
    }
  }

  const pdfBytes = await pdfDoc.save()
  let outputPath = path.join(app.getPath("documents"), saveName)
  outputPath = getUniqueFilePath(outputPath)
  fs.writeFileSync(outputPath, pdfBytes)

  return outputPath
}
