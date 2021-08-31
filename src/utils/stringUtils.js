/* given a filename, generates a slug */
/* this allows us to infer slugs when they aren't present */

const generateSlug = (filename) => {
  /* finds the location of the first thing after src/pages/ */
  const pagesSelector = /(?<=src\/(pages|content)).*/
  /* finds the location of .md or /index.md to remove it */
  const suffixSelector = /(index\.mdx?)|(\.mdx?)/
  const indexes = [
    filename.match(pagesSelector).index,
    filename.match(suffixSelector).index,
  ]
  return filename.substring(indexes[0], indexes[1])
}

export {generateSlug}
