interface PostMeta {
  date: string | Date
  title: string
  subtitle: string
}

interface TOCItem {
  level: number
  slug: string
  title: string
}

export interface Post {
  data: PostMeta
  toc: TOCItem[]
  content: string
}
