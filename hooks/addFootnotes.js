/** the bulk of the action*/
function transformer(tree, footnotes, parent, index) {
  if (tree.type === 'linkReference') {
    // if index === 0, not a footnote
    if (index === 0) {
      return
    }
    footnotes.push(tree.label)
    const link = `<a class="footnote-link" href="#note-${footnotes.length}">${footnotes.length}</a>`

    // delete the opening carat from the previous node

    parent.children[index - 1].value = parent.children[
      index - 1
    ].value.replace(/\^$/, '')

    const sup = `<sup id="fn-${footnotes.length}">${link}</sup>`
    // replace the note as HTML
    parent.children[index] = {
      type: 'html',
      value: sup,
    }
  }

  // recurse over children, if there are children
  tree.children &&
    tree.children.forEach((child, index) =>
      transformer(child, footnotes, tree, index),
    )
}

/** wrapper to package the transformer as a remark plugin */
export default function addFootnotes() {
  /** wrapper to collect and append the footnotes to the tree */
  return function (tree) {
    const footnotes = []
    transformer(tree, footnotes)
    const renderedFootnotes = footnotes
      .map(
        (note, i) =>
          `<li class="footnote" id="note-${
            i + 1
          }">${note} <a class="backlink" href="#fn-${
            i + 1
          }">↩</a></li>`,
      )
      .join('')
    const footer = renderedFootnotes
      ? `<hr/><ol class="footnotes">${renderedFootnotes}</ol>`
      : ''
    tree.children = [
      ...tree.children,
      {type: 'html', value: footer},
    ]
  }
}
