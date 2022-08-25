import type {Entry, CV} from '../../src/routes/cv/types'
import {marked} from 'marked'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'
import importZotero from './zotero'
import yaml from 'yaml'
const __dirname = dirname(fileURLToPath(import.meta.url))

function markup(section: {name: string; entries: Entry[]}) {
  return {
    ...section,
    entries: section.entries.map((entry: Entry) => {
      if (entry.type !== 'markdown') return entry
      return {
        type: 'markup' as const,
        markup: marked(entry.markdown),
      }
    }),
  }
}

async function processCV() {
  const cv = (await fs
    .readFile(__dirname + '/cv.yaml', 'utf-8')
    .then(yaml.parse)) as CV

  cv.sections = [
    ...cv.sections.map(markup),
    ...(await importZotero()),
  ]
  fs.writeFile(
    resolve(__dirname, '../../static/cv.json'),
    JSON.stringify(cv),
  )
}

processCV()
