import {toString} from "mdast-util-to-string"
import GithubSlugger from "github-slugger"

type MarkdownNode = {
  type: string
  depth?: number
  children?: MarkdownNode[]
}

type TocItem = {
  level: number
  slug: string
  title: string
}

function collectHeadings(
  tree: MarkdownNode,
  slugger: GithubSlugger,
  toc: TocItem[],
) {
  if (tree.type !== "heading") {
    return (
      tree.children &&
      tree.children.forEach((child) =>
        collectHeadings(child, slugger, toc),
      )
    )
  }
  if (tree.depth === 1)
    throw new Error(
      `h1 detected!
      There should be only one h1 element per page semantically,
      and for these posts this is the title meta attribute. Please start headings at
      level two in markdown files!`,
    )

  const title = toString(tree)
  toc.push({
    level: tree.depth as number,
    slug: slugger.slug(title),
    title,
  })
}

function assembleToc(tocItems: TocItem[]) {
  if (!tocItems.length) return ""
  const openLevels: number[] = []
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

/** Prepends a table of contents built from the document's headings.
 * Slugs use github-slugger so they match the ids that rehype-slug
 * assigns to the headings themselves. */
function makeTOC() {
  return function (
    tree: MarkdownNode & {children: MarkdownNode[]},
  ) {
    const tocItems: TocItem[] = []
    collectHeadings(tree, new GithubSlugger(), tocItems)
    const assembled = assembleToc(tocItems)

    const printableToc = assembled
      ? `<div class="toc"><em>In this post:</em>${assembled}</div>`
      : ""

    tree.children = [
      {type: "html", value: printableToc} as MarkdownNode,
      ...tree.children,
    ]
  }
}

export default makeTOC
