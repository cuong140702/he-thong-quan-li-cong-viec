import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const generateRandomFilename = (filename: string) => {
  const extension = path.extname(filename)
  return `${uuidv4()}${extension}`
}
