import {writable} from 'svelte/store'

interface Pages {
  projects: JSON
  writing: JSON
}

export const pages = writable(undefined as Pages)
