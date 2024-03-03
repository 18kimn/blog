import {Cite} from '@citation-js/core'
import '@citation-js/plugin-bibtex'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {dirname} from 'path'
import type {CV, Entry} from '../../src/routes/cv/types'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function importCitations(): Promise<
  CV['sections']
  > {
  const zotbib = await fs.readFile(
    __dirname + '/personal.json',
    'utf-8',
  )
  const references = new Cite(zotbib).data as any[]

  const categories = [
    {
      name: 'Peer-reviewed Publications',
      condition: (ref) => ref.type === 'article-journal',
    },
    {
      name: 'Conference Presentations',
      condition: (ref) => ref.type === 'paper-conference',
    },
    {
      name: 'Other Presentations',
      condition: (ref) => ref.type === 'speech',
    },
    {
      name: 'Misc. Work',
      condition: (ref) => ['document', 'report'].includes(ref.type),
    },
  ]

  function convertIssuedToDate(issued: [string, number, number?][]){
    const date = issued['date-parts'][0]
    return new Date(`${date[0]}-${date[1]}-${date[2] || ''}`)
  }

  return categories.map((cat) => ({
    name: cat.name,
    entries: references
      .filter(cat.condition)
      .map((ref) => ({type: 'csl', csl: ref}))
      .sort((a, b) => {
        // if has no date, assume it's in-progress and list it first
        if(!a.csl.issued){
          return -1
        } else if (!b.csl.issued){
          return 1
        }
        if(!a.csl.issued['date-parts']) {
          throw new Error(JSON.stringify(a.csl.issued))
        }
        const aDate = Number(convertIssuedToDate(a.csl.issued))
        const bDate = Number(convertIssuedToDate(b.csl.issued))
        // more recent listed first
        return bDate - aDate
      }) as Entry[],
  }))
}
