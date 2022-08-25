import yaml from 'yaml'
import {browser} from '$app/env'
import currentlyFile from '../lib/currently.yaml'
import infoFile from '../lib/homepage.yaml'

type Info = {
  display: string
  info: string
  link?: string
}

function processYaml(file: any){
  const unescaped = file.render().html.replaceAll('&gt;', '>').replaceAll('&quot;', '"')

  return yaml.parse(unescaped)
}

export const load = async () => {
  if (browser) return

  //for some reason this works?
  const info: {[type: string]: Info[]} = processYaml(infoFile)

  const currently = processYaml(currentlyFile)
  return {currently, info}
}
