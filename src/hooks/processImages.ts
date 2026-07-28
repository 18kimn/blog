import {resolve, parse, extname} from "path"
import {promises as fs} from "fs"
import {
  optimizeImage,
  RASTER_EXTENSIONS,
} from "./optimizeImage.ts"

async function processImages(dir: string) {
  const originals = await fs.readdir(resolve("static", dir))

  await Promise.all(
    originals
      .filter((original) =>
        RASTER_EXTENSIONS.includes(extname(original)),
      )
      .map((original) =>
        optimizeImage(
          resolve("static", dir, original),
          `static/${dir}/${parse(original).name}.webp`,
        ),
      ),
  )
}

processImages("personal_images")
