import {promises as fs} from 'fs'
import {dirname, resolve, join, extname, basename} from 'path'
import {fileURLToPath} from 'url'
import matter from 'gray-matter'
import sharp from 'sharp'
import renderMarkdown from './renderer'

const __dirname = dirname(fileURLToPath(import.meta.url))
process.chdir(resolve(__dirname, '..'))

const TARGET = 'public/'
const BASE = 'content/'

/** traverses the content directory and moves stuff over to public
 * In the process:
 * - renders markdown with custom options (see ./renderer.ts)
 * - resizes/compresses images with sharp
 * */
async function build(path: string) {
  await fs.mkdir(join(TARGET, path), {recursive: true})
  const files = await fs.readdir(path)
  const promises = files.reduce(async (prevPromise, file) => {
    const prev = await prevPromise
    if (file.match('unpublished')) return prev
    const startPath = join(path, file)
    const targetPath = join(TARGET, startPath)
    const isFolder = (await fs.lstat(startPath)).isDirectory()
    if (isFolder) return [...prev, ...(await build(startPath))]
    const ext = extname(file)
    if (['.png', '.jpg'].includes(ext)) {
      const imageBuffer = await sharp(resolve(path, file))
        .resize(600)
        .jpeg({
          progressive: true,
          mozjpeg: true,
          force: false,
          quality: 80,
        })
        .png({
          progressive: true,
          force: false,
          quality: 80,
          compressionLevel: 9,
        })
        .toBuffer()
      await fs.writeFile(targetPath, imageBuffer)
    } else if (ext === '.md') {
      const text = await fs.readFile(startPath, 'utf-8')
      const {data, content} = matter(text)
      const {toc, html} = renderMarkdown(
        content,
        basename(dirname(targetPath)) + '/',
      )
      await fs.writeFile(
        targetPath,
        JSON.stringify({
          data,
          toc,
          content: html,
        }),
      )
      return [...prev, {name: dirname(startPath), ...data}]
    } else {
      await fs.copyFile(startPath, targetPath)
    }
    return prev
  }, Promise.resolve([]))

  return promises
}

await fs.rm(join(TARGET, BASE), {recursive: true, force: true})
const projects = await build('content/projects')
const writing = await build('content/writing')
const index = {
  projects,
  writing,
}
await fs.writeFile('public/posts.json', JSON.stringify(index))
