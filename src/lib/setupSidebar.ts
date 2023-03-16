import {getFootnotes} from './footnotes'

export default function setupSidebar() {
  const footnotes = getFootnotes()
  /* After Svelte does an initial (invisible) render,
    grab that information and represent it with footnotes alongside it*/
  const nodes = [
    ...(document.querySelector('.article-shadow')
      ?.children as HTMLCollection),
  ]

  const rows = nodes.map((node) => {
    const footnoteReferences =
      node.querySelectorAll('[id^="fn-"]')
    if (!footnoteReferences?.length)
      return {
        node,
      }
    const footnoteIDs = [...footnoteReferences].map(
      (el) => `#${el.id}`,
    )
    const containingFootnotes = footnotes.filter(
      (footnote) => footnoteIDs.includes(footnote.href),
    )
    return {
      node,
      footnotes: containingFootnotes,
    }
  })

  return rows
}
