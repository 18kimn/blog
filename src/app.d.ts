/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type {Session} from '@auth/sveltekit'

declare global {
  namespace App {
    interface Locals {
      auth(): Promise<Session | null>
      getSession(): Promise<Session | null>
    }
  }
}

export {}
