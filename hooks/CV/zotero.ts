import {Cite} from '@citation-js/core'
import '@citation-js/plugin-bibtex'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {dirname} from 'path'
import type {CV, Entry} from '../../src/routes/cv/types'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function importZotero(): Promise<
  CV['sections']
  > {
  const zotbib = await fs.readFile(
    __dirname + '/personal.bib',
    'utf-8',
  )
  const references = new Cite(zotbib, {
    forceType: '@bibtex/text',
  }).data as any[]

  return [
    {
      name: 'Publications',
      entries: references
        .filter((ref) => ref.type === 'article-journal')
        .map((ref) => ({type: 'csl', csl: ref})) as Entry[],
    },
    {
      name: 'Presentations',
      entries: references
        .filter((ref) => ref.type === 'paper-conference')
        .map((ref) => ({type: 'csl', csl: ref})) as Entry[],
    },
    {
      name: 'Misc. Work',
      entries: references
        .filter(
          (ref) =>
            ![
              'article-journal',
              'paper-conference',
            ].includes(ref.type),
        )
        .map((ref) => ({type: 'csl', csl: ref})) as Entry[],
    },
  ]
}
