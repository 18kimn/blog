import {resolve, parse} from 'path'
import {promises as fs} from 'fs'
import sharp from 'sharp'

async function processImages(dir) {
  const originals = await fs.readdir(resolve('static', dir))

  originals.forEach((original) => {
    sharp(resolve('static', dir, original))
      .resize(600)
      .webp()
      .toBuffer()
      .then((buff) => {
        fs.writeFile(
          `static/${dir}/${parse(original).name}.webp`,
          buff,
        )
      })
  })
}

processImages('personal_images')
