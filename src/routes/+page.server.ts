import yaml from 'yaml'
import {promises as fs} from 'fs'
import {browser} from '$app/env'
import currentlyFile from '../lib/currently.yaml'
import infoFile from '../lib/homepage.yaml'

type Info = {
  display: string
  info: string
  link?: string
}

export const load = async () => {
  if (browser) return

  //for some reason this works?
  const info: {[type: string]: Info[]} = yaml.parse(
    infoFile.render().html,
  )

  const currently = yaml.parse(currentlyFile.render().html)
  return {currently, info}
}
