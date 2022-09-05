import yaml from 'yaml'
import {browser} from '$app/env'
import currentlyFile from '../lib/currently.yaml?raw'
import infoFile from '../lib/homepage.yaml?raw'

type Info = {
  display: string
  info: string
  link?: string
}

export const load = async () => {
  if (browser) return

  //for some reason this works?
  const info: {[type: string]: Info[]} =
    yaml.parse(infoFile)

  const currently = yaml.parse(currentlyFile)
  return {currently, info}
}

export const prerender = true
