import yaml from 'yaml'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'
import {browser} from '$app/env'
type Info = {
  display: string
  info: string
  link?: string
}
const __dirname = dirname(fileURLToPath(import.meta.url))

export const load = async () => {
  if (browser) return
  const info: {[type: string]: Info[]} = await fs
    .readFile(
      resolve(__dirname, '../', 'lib/homepage.yaml'),
      'utf-8',
    )
    .then(yaml.parse)

  const currently = await fs
    .readFile(
      resolve(__dirname, '../', 'lib/currently.yaml'),
      'utf-8',
    )
    .then(yaml.parse)
  return {currently, info}
}
