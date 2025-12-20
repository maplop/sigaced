import fs from "fs"
import path from "path"

export function getUniqueFilePath(basePath: string): string {
  if (!fs.existsSync(basePath)) {
    return basePath
  }

  const dir = path.dirname(basePath)
  const ext = path.extname(basePath)
  const name = path.basename(basePath, ext)

  let counter = 1
  let newPath = path.join(dir, `${name} (${counter})${ext}`)

  while (fs.existsSync(newPath)) {
    counter++
    newPath = path.join(dir, `${name} (${counter})${ext}`)
  }

  return newPath
}
