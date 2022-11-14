import {jsPDF} from 'jspdf'
import type {CV} from './types'
/*
  sections.forEach((section) => {
    // add title as section.name
    // then
    section.entries.forEach((entry) => {
      if (entry.type === 'position') {
        // render entry.name on left hand side, bolded
        // render entry.role on left-hand side next to it
        // render entry.date on right-hand side
        // render entry.description below that
      } else if (entry.type === 'markup') {
        // somehow render html content...
      } else if (entry.type === 'csl') {
        // somehow
      }
    })
  })
*/

export default async function exportPDF(node: HTMLElement) {
  const doc = new jsPDF({
    format: 'a4',
    unit: 'px',
    hotfixes: ['px_scaling'],
  })
  doc.setLineHeightFactor(1)
  doc.setFontSize(10)
  console.log(doc.getFontList())

  const text = 'some bold text'
  doc.setFont('Lora', 'bold')
  doc.text(text, 10, 10)
  const dims = doc.getTextDimensions(text)
  doc.setFont('Lora', 'regular')
  doc.text('some normal text', dims.w, 10)
  doc.save('nathan-kim-cv.pdf')
}
