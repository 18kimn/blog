import {resolve, extname, basename, dirname} from "path"
import {promises as fs} from "fs"
import {
  optimizeImage,
  RASTER_EXTENSIONS,
} from "./optimizeImage.ts"

const baseDir = process.cwd()

type MediaNode = {
  type: string
  url?: string
  children?: MediaNode[]
}

type MarkdownFile = {filename: string}

/** recurses until it gets to links, then gives them an ID based on
 * dirname and filename and moves it to static. Image writes are
 * collected into `tasks` so the caller can await them — remark
 * transformers may run async, so we no longer fire-and-forget.
 * It also modifies the tree in place, which is sus but i guess
 * that's what remark plugins do.
 * */
function transformer(
  tree: MediaNode,
  file: MarkdownFile,
  tasks: Promise<unknown>[],
) {
  if (tree.url) {
    tree.url = tree.url.replace(".md", "")
  }
  if (
    ["image", "video", "audio"].includes(tree.type) &&
    tree.url
  ) {
    const dir = basename(dirname(file.filename))
    const originalFile = resolve(
      dirname(file.filename),
      tree.url,
    )
    const ext = extname(originalFile)

    if (RASTER_EXTENSIONS.includes(ext)) {
      const url = `images/${dir}_${basename(
        tree.url.replace(/^\.\//, ""),
        ext,
      )}.webp`
      tasks.push(
        optimizeImage(
          originalFile,
          resolve(baseDir, "static", url),
        ),
      )
      tree.url = "/" + url
    } else {
      const url = `images/${dir}_${tree.url.replace(
        /^\.\//,
        "",
      )}`
      tasks.push(
        fs.copyFile(
          originalFile,
          resolve(baseDir, "static", url),
        ),
      )
      tree.url = "/" + url
    }
  }

  // recurse over children, if there are children
  tree.children &&
    tree.children.forEach((child) =>
      transformer(child, file, tasks),
    )
}

export default function resolveLinks() {
  return async (tree: MediaNode, file: MarkdownFile) => {
    const tasks: Promise<unknown>[] = []
    transformer(tree, file, tasks)
    await Promise.all(tasks)
  }
}
