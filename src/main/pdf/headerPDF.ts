import fs from "fs"
import path from "path"
import { PDFPage, PDFDocument, StandardFonts, rgb } from "pdf-lib"

interface HeaderPDFOptions {
  page: PDFPage
  pdfDoc: PDFDocument
  startY: number
  marginLeft: number
}

export async function headerPDF({ page, pdfDoc, startY, marginLeft }: HeaderPDFOptions) {
  const now = new Date()
  const formattedDate = now.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })

  const HEADER_TITLE = `UNIVERSIDAD CENTRAL "MARTA ABERU" DE LAS VILLAS`
  const HEADER_IMAGE = path.join(process.cwd(), "resources/uclv.png")
  const SUB_TEXT =
    "GAPCED — Gestión de Otorgamiento de Plazas del Curso por Encuentro y a Distancia"
  const DATE = formattedDate

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  let y = startY

  // Fecha arriba a la derecha
  const dateFontSize = 10
  const dateTextWidth = font.widthOfTextAtSize(DATE, dateFontSize)
  const dateX = page.getWidth() - marginLeft - dateTextWidth
  const dateY = y - dateFontSize

  page.drawText(formattedDate, {
    x: dateX,
    y: dateY,
    size: dateFontSize,
    font,
    color: rgb(0.3, 0.3, 0.3)
  })

  // Imagen fija
  let imgHeight = 0
  if (fs.existsSync(HEADER_IMAGE)) {
    const imgBytes = fs.readFileSync(HEADER_IMAGE)
    const image = HEADER_IMAGE.endsWith(".png")
      ? await pdfDoc.embedPng(imgBytes)
      : await pdfDoc.embedJpg(imgBytes)

    const imgWidth = 50
    imgHeight = (image.height / image.width) * imgWidth

    page.drawImage(image, {
      x: marginLeft,
      y: y - imgHeight,
      width: imgWidth,
      height: imgHeight
    })
  }

  // Título fijo centrado verticalmente respecto a la imagen
  const fontSize = 14
  const textHeight = fontSize
  const textY = y - imgHeight / 2 - textHeight / 2

  page.drawText(HEADER_TITLE, {
    x: marginLeft + 70,
    y: textY,
    size: fontSize,
    font,
    color: rgb(0.3, 0.3, 0.3)
  })

  page.drawText(SUB_TEXT, {
    x: marginLeft + 70,
    y: textY - 10,
    size: 9,
    font,
    color: rgb(0.4, 0.4, 0.4)
  })

  return y - 60
}
