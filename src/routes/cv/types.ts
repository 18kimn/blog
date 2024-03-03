export type Position = {
  name: string
  date: string
  description: string
  role?: string
}

export type Other = {
  type: 'other'
  markdown: string
}

export type Ref =
  | {
      type: 'ref'
      doi: string
    }
  | {
      type: 'ref'
      bibjson: string
    }

// subset of return obj from new Cite().data in citation-js
export type CSL = {
  type: 'csl'
  csl: {[prop: string]: any}
  markup?: string
}

export type Entry =
  | Position
  | Ref
  | CSL
  | Other
  | {
      type: 'markup'
      markup: string
    }
  | {
      type: 'markdown'
      markdown: string
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
