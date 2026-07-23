type HastNode = {
  type: string
  tagName?: string
  properties?: {className?: string[]; [key: string]: unknown}
  children?: HastNode[]
  value?: string
}

const headingTags = ["h2", "h3", "h4", "h5", "h6"]

/** rehype-slug gives headings ids and rehype-autolink-headings adds the
 * "#" permalink. This adds the two things those plugins can't: the
 * "heading" class the hover-reveal CSS keys off of, and a "back to top"
 * link pointing at the fixed #frontmatter anchor. */
function transformer(node: HastNode) {
  if (
    node.type === "element" &&
    node.tagName &&
    headingTags.includes(node.tagName)
  ) {
    node.properties = node.properties || {}
    node.properties.className = [
      ...(node.properties.className || []),
      "heading",
    ]
    node.children = node.children || []
    node.children.push({
      type: "element",
      tagName: "a",
      properties: {
        className: ["heading-link"],
        href: "#frontmatter",
      },
      children: [{type: "text", value: "🠑"}],
    })
  }
  node.children &&
    node.children.forEach((child) => transformer(child))
}

export default function headingLinks() {
  return transformer
}
