function transformer(tree, toc, parent, index) {
  /*
   * TOC markup should look like
   * <ol>
   *  <li>top heading</li>
   *  <li>
   *    second top-level heading
   *    <ol>
   *      <li> sub-item</li>
   *      <li> sub-item</li>
   *    </ol>
   *  </li>
   * </ol>
   *
   */
  if (tree.type !== "heading") {
    // recurse over children, if there are children
    return (
      tree.children &&
      tree.children.forEach((child, index) =>
        transformer(child, toc, tree, index),
      )
    )
  }
  const level = tree.depth
  if (tree.depth === 1)
    throw new Error(
      `h1 detected! 
      There should be only one h1 element per page semantically,
      and for these posts this is the title meta attribute. Please start headings at 
      level two in markdown files!`,
    )

  const text = tree.children
    .map((child) => child.value)
    .join("")
  const slug = text.toLowerCase().replace(/[^\w]+/g, "-")
  toc.push({
    level,
    slug: slug,
    title: text,
  })

  const heading = `<h${level} class="heading" id="${slug}">${text}`
  const linkToHeading = `<a class="heading-link" href="#${slug}">#</a>`
  const toTop =
    "<a class=\"heading-link\" href=\"#frontmatter\">🠑</a>"

  // replace the heading in the tree with markup
  parent.children[index] = {
    type: "html",
    value: heading + linkToHeading + toTop + `</h${level}>`,
  }
}
function assembleToc(tocItems) {
  if (!tocItems.length) return ""
  const openLevels = []
  let html = ""
  tocItems.forEach((item) => {
    if (openLevels.length === 0) {
      html += "<ol>"
      openLevels.push(item.level)
    } else if (item.level > openLevels[openLevels.length - 1]) {
      html += "<ol>"
      openLevels.push(item.level)
    } else {
      html += "</li>"
      while (
        openLevels.length > 1 &&
        openLevels[openLevels.length - 1] > item.level
      ) {
        html += "</ol></li>"
        openLevels.pop()
      }
    }
    html += `<li><a href="#${item.slug}">${item.title}</a>`
  })
  html += "</li>"
  while (openLevels.length > 1) {
    html += "</ol></li>"
    openLevels.pop()
  }
  html += "</ol>"
  return html
}

/** Renders markdown with a table of contents */
function makeTOC() {
  return function (tree) {
    const tocItems = []
    transformer(tree, tocItems)
    const assembled = assembleToc(tocItems)

    const printableToc = assembled
      ? `<div class="toc"><em>In this post:</em>${assembled}</div>`
      : ""

    tree.children = [
      {type: "html", value: printableToc},
      ...tree.children,
    ]
  }
}

export default makeTOC
