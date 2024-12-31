export function setupDialog(
  dialog: HTMLDialogElement,
  cb = () => {},
) {
  // what a pain in the butt
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    const isWithin =
      x < rect.right &&
      x > rect.left &&
      y > rect.top &&
      y < rect.bottom
    /* if click isn't on gear or the dialog itself, close it
     */
    if (!isWithin && e.target !== opener) {
      dialog.style.opacity = '0'
      dialog.close()
      setTimeout(() => {
        dialog.style.display = 'none'
        cb()
      }, 200)
    }
  })
}
