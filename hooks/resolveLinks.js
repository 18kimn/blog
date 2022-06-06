import {resolve, basename, dirname} from 'path'
import {promises as fs} from 'fs'

const baseDir = process.cwd()
/** Make markdown writing and rendering more ergonomic
 * */
export default function resolveLinks() {
  /** recurses until it gets to links, then gives them an ID based on
   * dirname and filename and moves it to static
   * it also modifies in place, which is sus
   * but i guess that's what remark
   * plugins do
   * */
  function transformer(tree, file) {
    console.log(tree)
    if (['image', 'video', 'audio'].includes(tree.type)) {
      const dir = basename(dirname(file.filename))
      const originalFile = resolve(dirname(file.filename), tree.url)

      const url = `images/${tree.url.replace(/^\.\//, dir + '_')}`
      console.log(resolve(baseDir, 'static', url))

      /* here is where procesing with sharp should go */
      fs.copyFile(originalFile, resolve(baseDir, 'static', url))
      tree.url = '/' + url
    }
    tree.children &&
      tree.children.length > 0 &&
      tree.children.forEach((child) => transformer(child, file))
  }

  return transformer
}
