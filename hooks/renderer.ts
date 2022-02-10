import hljs from 'highlight.js'
import {marked} from 'marked'

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

/** hacky but whatever
 * @param str the string parameter to the marked text() and paragraph()
 * functions
 * @param array A footnote-containing array
 * @returns that string, marked up; appe
 * */
const replaceFootnote = (str: string, array: string[]) => {
  const matches = [...str.matchAll(/\^\[([^\]]+)\]/g)]
  if (!matches.length) return str

  return matches
    .map((match) => {
      const [whole, content] = match
      const {index} = match
      const end = whole.length + index
      array.push(content)
      return {start: index, end}
    })
    .map(({start, end}, index, pairs) => {
      const prevEnd = pairs[index - 1]?.end || 0
      const fragment = str.slice(prevEnd, start)
      const link = `<a href="#note-${array.length}">${array.length}</a>`
      const sup = `<sup id="fn-${array.length}">${link}</sup>`
      const suffix =
        index === pairs.length - 1 ? str.slice(end, str.length) : ''
      return `${fragment}${sup}${suffix}`
    })
    .join('')
}

/** Renders markdown with:
 * - links opening in new tabs
 * - code highlighting
 * - a table of contents
 * - image URLs prefixed with correct base path
 * */
function renderMarkdown(text: string, baseUrl: string) {
  const toc = []
  const footnotes = []
  const renderer = {
    code(code: string, language: string) {
      const validLang = !!(language && hljs.getLanguage(language))
      // Highlight only if the language is valid; otherwise
      // treat as need-to-escape stuff (preformatted)
      const highlighted = validLang
        ? hljs.highlightAuto(code).value
        : escapeForHTML(code)

      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
    },
    link(href: string, title: string, text: string) {
      const link = marked.Renderer.prototype.link.call(
        this,
        href,
        title,
        text,
      )
      return link.replace('<a', '<a target=\'_blank\' ')
    },
    heading(text: string, level: number) {
      const slug = text.toLowerCase().replace(/[^\w]+/g, '-')
      toc.push({
        level: level,
        slug: slug,
        title: text,
      })

      const heading = `<h${level} class="heading" id="${slug}">${text}`
      const toTop =
        '<a class="heading-link" href="#frontmatter">🠑</a>'
      const link = `<a class="heading-link" href="#${slug}">#</a></h${level}>`
      return heading + toTop + link
    },
    paragraph(text: string) {
      return marked.Renderer.prototype.paragraph.call(
        this,
        replaceFootnote(text, footnotes),
      )
    },
    text(text: string) {
      return marked.Renderer.prototype.text.call(
        this,
        replaceFootnote(text, footnotes),
      )
    },
  }

  marked.use({renderer})
  const rendered = marked(text, {baseUrl})
  const renderedFootnotes = footnotes
    .map(
      (note, i) =>
        `<li id="note-${
          i + 1
        }">${note} <a class="backlink" href="#fn-${
          i + 1
        }">↩</a></li>`,
    )
    .join('')
  const footer = renderedFootnotes
    ? `<hr/><ol>${renderedFootnotes}</ol>`
    : ''
  return {html: rendered + footer, toc}
}

export default renderMarkdown
