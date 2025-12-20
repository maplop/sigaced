import { rgb } from "pdf-lib"

export const rgb255 = (r: number, g: number, b: number) => rgb(r / 255, g / 255, b / 255)
