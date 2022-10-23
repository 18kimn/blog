export interface Post {
  date: string | Date
  title: string
  subtitle: string
  path: string
  modified?: string[]
  tags?: string[]
  content?: string
}