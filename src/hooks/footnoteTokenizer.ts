export const FOOTNOTE_NODE = "inlineFootnote"

type Point = {line: number; column: number; offset: number}

type Eat = ((subvalue: string) => (node: unknown) => unknown) & {
  now: () => Point
}

type LegacyParser = {
  tokenizeInline: (value: string, now: Point) => unknown[]
}

export type InlineTokenizer = {
  (this: LegacyParser, eat: Eat, value: string, silent?: boolean): unknown
  locator?: (value: string, fromIndex: number) => number
}

const CARET = 94 // ^
const OPEN = 91 // [
const CLOSE = 93 // ]
const BACKSLASH = 92 // \

/** Pandoc-style inline footnotes: `^[ ...markdown... ]`. This is a
 * remark-parse (legacy, mdsvex-bundled) inline tokenizer. It claims the
 * `^[` opener, finds the matching `]` (tracking nested brackets and
 * escapes), and re-parses the interior with `tokenizeInline` so the note
 * body supports the full inline grammar — emphasis, code, AND links,
 * which the old `[label]`-reference hack could never nest. */
const tokenizeInlineFootnote: InlineTokenizer = function (
  eat,
  value,
  silent,
) {
  if (
    value.charCodeAt(0) !== CARET ||
    value.charCodeAt(1) !== OPEN
  )
    return

  let depth = 0
  let index = 1
  const length = value.length
  while (++index < length) {
    const code = value.charCodeAt(index)
    if (code === BACKSLASH) {
      index++
      continue
    }
    if (code === OPEN) {
      depth++
    } else if (code === CLOSE) {
      if (depth === 0) break
      depth--
    }
  }

  // ran off the end without a matching `]` — not a footnote
  if (index >= length) return

  if (silent) return true

  const subvalue = value.slice(0, index + 1) // ^[ ... ]
  const content = value.slice(2, index) // interior

  const now = eat.now()
  now.column += 2
  now.offset += 2

  return eat(subvalue)({
    type: FOOTNOTE_NODE,
    children: this.tokenizeInline(content, now),
  })
}

tokenizeInlineFootnote.locator = function (value, fromIndex) {
  return value.indexOf("^[", fromIndex)
}

export default tokenizeInlineFootnote
