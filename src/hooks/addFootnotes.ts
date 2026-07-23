import tokenizeInlineFootnote, {
  FOOTNOTE_NODE,
  type InlineTokenizer,
} from "./footnoteTokenizer.ts"

type MarkdownNode = {
  type: string
  value?: string
  children?: MarkdownNode[]
}

type LegacyParserConstructor = {
  prototype: {
    inlineTokenizers: Record<string, InlineTokenizer>
    inlineMethods: string[]
  }
}

type Processor = {
  Parser?: LegacyParserConstructor
}

/** walks the tree, swapping each inline-footnote node for a numbered
 * superscript marker and collecting its (already parsed) children */
function collectFootnotes(
  node: MarkdownNode,
  footnotes: MarkdownNode[][],
  parent?: MarkdownNode,
  index?: number,
) {
  if (node.type === FOOTNOTE_NODE) {
    footnotes.push(node.children || [])
    const n = footnotes.length
    parent!.children![index!] = {
      type: "html",
      value: `<sup id="fn-${n}"><a class="footnote-link" href="#note-${n}">${n}</a></sup>`,
    }
    return
  }

  node.children &&
    node.children.forEach((child, i) =>
      collectFootnotes(child, footnotes, node, i),
    )
}

/** Registers the `^[...]` inline tokenizer on mdsvex's bundled
 * remark-parse, then renders the collected notes into the footnote list.
 * The rendering (superscript markers, `note-N`/`fn-N` ids, backlinks,
 * `<ol class="footnotes">`) is unchanged from the previous plugin so the
 * sidebar in footnotes.ts and its CSS keep working. */
export default function addFootnotes(this: Processor) {
  const Parser = this && this.Parser
  if (Parser) {
    const {inlineTokenizers, inlineMethods} = Parser.prototype
    if (!inlineTokenizers[FOOTNOTE_NODE]) {
      inlineTokenizers[FOOTNOTE_NODE] = tokenizeInlineFootnote
      inlineMethods.splice(
        inlineMethods.indexOf("text"),
        0,
        FOOTNOTE_NODE,
      )
    }
  }

  return function (tree: MarkdownNode & {children: MarkdownNode[]}) {
    const footnotes: MarkdownNode[][] = []
    collectFootnotes(tree, footnotes)
    if (!footnotes.length) return

    // wrap each note's nodes in raw-html <li> tags; the nodes in
    // between stay real mdast, so their markup (links included) renders
    const items = footnotes.flatMap((children, i) => [
      {
        type: "html",
        value: `<li class="footnote" id="note-${i + 1}">`,
      },
      ...children,
      {
        type: "html",
        value: ` <a class="backlink" href="#fn-${
          i + 1
        }">↩</a></li>`,
      },
    ])

    tree.children = [
      ...tree.children,
      {type: "html", value: "<hr/><ol class=\"footnotes\">"},
      ...items,
      {type: "html", value: "</ol>"},
    ]
  }
}
