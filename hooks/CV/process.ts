import type {CV} from '../../src/lib/CV/types'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'
import importZotero from './zotero'
const __dirname = dirname(fileURLToPath(import.meta.url))

async function processCV() {
  const cv = (await fs
    .readFile(__dirname + '/cv.json', 'utf-8')
    .then(JSON.parse)) as CV

  /* query zotero for other sections */
  cv.sections = [...cv.sections, ...(await importZotero())]
  fs.writeFile(
    resolve(__dirname, '../../static/cv.json'),
    JSON.stringify(cv),
  )
}

processCV()
