import {promises as fs} from 'fs'
import {dirname, resolve, join, extname} from 'path'
import {fileURLToPath} from 'url'
import {marked, Renderer} from 'marked'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
process.chdir(resolve(__dirname, '..'))

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}

const escapeForHTML = (input: string) => {
  return input.replace(
    /([&<>'"])/g,
    (char: string) => escapeMap[char],
  )
}

// Create your custom renderer.
const renderer = new Renderer()
renderer.code = (code, language) => {
  const validLang = !!(language && hljs.getLanguage(language))

  // Highlight only if the language is valid; otherwise
  // treat is as need-to-escape stuff (preformatted)
  const highlighted = validLang
    ? hljs.highlightAuto(code).value
    : escapeForHTML(code)

  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
}

// Set the renderer to marked.
marked.setOptions({renderer})

const TARGET = 'public/'
const BASE = 'content/'

/** traverses the content directory and moves stuff over to public
 * In the process:
 * - renders markdown with marked
 * - frontmatter parsing with gray-matter
 * - syntax highlighting with hljs
 * - prefixing to make image linking work correctly (in progress)
 * - resizes/compresses images with sharp
 * */
async function build(path: string) {
  await fs.mkdir(join(TARGET, path), {recursive: true})
  const files = await fs.readdir(path)
  const promises = files.reduce(async (prevPromise, file) => {
    const prev = await prevPromise
    const startPath = join(path, file)
    const targetPath = join(TARGET, startPath)
    const isFolder = (await fs.lstat(startPath)).isDirectory()
    if (isFolder) return [...prev, ...(await build(startPath))]
    const ext = extname(file)
    if (['.png', '.jpg'].includes(ext)) {
      const imageBuffer = await sharp(resolve(path, file))
        .resize(400)
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
      await fs.writeFile(
        targetPath,
        JSON.stringify({data, content: marked(content)}),
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
const index = await build(BASE)
await fs.writeFile('public/projects.json', JSON.stringify(index))
