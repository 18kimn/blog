import {writable} from 'svelte/store'

export const firstRender = writable(true)
export const postDataKey = Symbol()
