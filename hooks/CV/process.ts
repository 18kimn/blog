import type {Entry, CV} from '../../src/routes/cv/types'
import {marked} from 'marked'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'
import importCitations from './importCitations'
import {parse} from 'yaml'
const __dirname = dirname(fileURLToPath(import.meta.url))

function markup(section: {name: string; entries: Entry[]}, citations: Awaited<ReturnType<typeof importCitations>>) {
  // substitute placeholders from YAML with equivalent from Zotero
  const zotKeys = citations.map(c => c.name)
  if(zotKeys.includes(section.name)){
    return citations.find(c=> c.name === section.name)
  }

  return {
    ...section,
    entries: section.entries?.map((entry: Entry) => {
      if(!('type' in entry)) return entry
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
    .then(parse)) as CV
  const citations = await importCitations()

  cv.sections = cv.sections.map((section) => markup(section, citations))

  // Section names from importCitations are also in the YAML file
  // No empty sections
  citations.forEach(citation => {
    if(!cv.sections.find(section => {
      return section.name === citation.name
    })){
      throw new Error(`${citation.name} not found`)
    }
    if(!citation.entries.length){
      throw new Error(`${citation.name} has no entries`)
    }
  })

  fs.writeFile(
    resolve(__dirname, '../../static/cv.json'),
    JSON.stringify(cv),
  )
}

processCV()
