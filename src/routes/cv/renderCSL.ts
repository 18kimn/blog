import {Cite} from '@citation-js/core'
import '@citation-js/plugin-csl'
import type {CV} from './types'

// dynamic/async

function reprocessHTML(html: string) {
  return html.replace(
    // basic url matching
    /http.*?(?=<)/,
    '<a href="$&" rel="noopener" target="__blank">$&</a>',
  )
}

export default function renderCSL(
  sections: CV['sections'],
  csl: string,
): CV['sections'] {
  if (!csl || !sections) return sections
  return sections.map((section) => ({
    ...section,
    entries: section.entries.map((entry) => {
      if(!('type' in entry)) return entry
      if (entry.type !== 'csl') return entry
      const cite = new Cite(entry.csl)
      return {
        ...entry,
        markup: reprocessHTML(
          cite.format('bibliography', {
            format: 'html',
            template: csl,
          }),
        ),
      }
    }),
  }))
}
