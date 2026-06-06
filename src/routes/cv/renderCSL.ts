import {Cite} from '@citation-js/core'
import '@citation-js/plugin-csl'
import type {CV, CSL} from './types'

export default function renderCSL(
  sections: CV['sections'],
  csl: CSL,
): CV['sections'] {
  if (!csl || !sections) return sections
  return sections.map((section) => ({
    ...section,
    entries: section.entries.map((entry) => {
      if (!('type' in entry)) return entry
      if (entry.type !== 'csl') return entry

      const cite = new Cite(entry.csl)
      const formatted = cite.format('bibliography', {
        format: 'html',
        template: csl.key,
      })

      if (formatted.match(/n\.d\./)) {
        console.error(`Missing date for ${formatted}`)
      }

      const reprocessed = formatted
        .replace(
          // basic url matching
          /http.*?(?=\.<)/,
          '<a href="$&" rel="noopener" target="__blank">$&</a>',
        )
        // assume nd entries are mistakes
        .replaceAll(/ n\.d\./g, '.')
        .replaceAll(/,”\./g, '.”')
        // Bold "N. Kim" and so on
        .replace(
          new RegExp(
            '(Nathan Kim)|(Kim, Nathan)|(Kim, N.)',
          ),
          '<strong>$&</strong>',
        )
        // super hacky
        .replace(
          new RegExp('class="csl-entry">'),
          entry.csl.note && entry.csl.type == 'manuscript'
            ? `$&<em>(${entry.csl.note}) </em>`
            : '$&',
        )

      return {
        ...entry,
        markup: reprocessed,
      }
    }),
  }))
}
