export type Position = {
  name: string
  date: string
  description: string
  role?: string
}

export type Other = {
  markdown: string
}

export type Ref =
  | {
      doi: string
    }
  | {
      bibjson: string
    }

// subset of return obj from new Cite().data in citation-js
export type CSL = {
  csl: {[prop: string]: any}
}

export type Entry =
  | Position
  | Ref
  | CSL
  | Other
  | {
      markup: string
    }

export interface CV {
  meta: {
    name: 'Nathan Kim'
    email: string
    website: string
    twitter: string
    last_updated: Date
  }
  sections: {
    name: string
    entries: Entry[]
  }[]
}
