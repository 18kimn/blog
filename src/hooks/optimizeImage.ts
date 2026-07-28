import {promises as fs} from "fs"
import sharp from "sharp"

export const RASTER_EXTENSIONS = [".png", ".jpeg", ".jpg"]

export async function optimizeImage(
  source: string,
  destination: string,
  width = 600,
) {
  const buffer = await sharp(source)
    .resize(width)
    .webp()
    .toBuffer()
  await fs.writeFile(destination, buffer)
}
