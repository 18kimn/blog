import {resolve, extname, basename, dirname} from 'path'
import {promises as fs} from 'fs'
import sharp from 'sharp'

const baseDir = process.cwd()

/** recurses until it gets to links, then gives them an ID based on
 * dirname and filename and moves it to static
 * it also modifies in place, which is sus
 * but i guess that's what remark
 * plugins do
 * */
function transformer(tree, file) {
  if (tree.url) {
    tree.url = tree.url.replace('.md', '')
  }
  if (['image', 'video', 'audio'].includes(tree.type)) {
    const dir = basename(dirname(file.filename))
    const originalFile = resolve(
      dirname(file.filename),
      tree.url,
    )
    const ext = extname(originalFile)

    if (['.png', '.jpeg', '.jpg'].includes(ext)) {
      const url = `images/${dir}_${basename(
        tree.url.replace(/^\.\//, ''),
        ext,
      )}.webp`
      sharp(originalFile)
        .resize(600)
        .webp()
        .toBuffer()
        .then((buff) => {
          fs.writeFile(
            resolve(baseDir, 'static', url),
            buff,
          )
        })
      tree.url = '/' + url
    } else {
      const url = `images/${dir}_${tree.url.replace(
        /^\.\//,
        '',
      )}`
      fs.copyFile(
        originalFile,
        resolve(baseDir, 'static', url),
      )
      tree.url = '/' + url
    }
  }

  // recurse over children, if there are children
  tree.children &&
    tree.children.forEach((child) =>
      transformer(child, file),
    )
}

/** For some reason the transformer needs to be wrapped in a function
 * (probably to accept params for the more general plugin)
 * */
export default function resolveLinks() {
  return transformer
}
