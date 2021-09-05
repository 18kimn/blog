import * as d3 from 'd3'
import {navigate} from 'gatsby'

const expandNavigate = (x) => {
  const container = d3.select(`.${x}`)
  const duration = 500
  // transitions:
  // from: 350px wide 200px tall and translated
  // to: 80vw wide calc(100% - 40px) tall, translate(0,0), with top: 0, left:0

  container
    .append('div')
    .style('width', '100%')
    .style('height', '100%')
    .style('opacity', 0)
    .style('position', 'fixed')
    .style('top', 0)
    .style('left', 0)
    .style('background-color', 'white')
    .transition()
    .delay(duration * 0.4)
    .duration(duration)
    .style('opacity', 1)

  container
    .style('z-index', 2)
    .transition()
    .duration(duration)
    .styleTween('transform', () => {
      const transform = container.style('transform')
      const pcts = [...transform.matchAll(/%/g)]
      const transformX = transform.substring(
        transform.match(/[-]?[0-9]/).index,
        pcts[0].index,
      )
      const transformY = transform.substring(
        transform.match(/,/).index + 2,
        pcts[1].index,
      )
      const interX = d3.interpolateNumber(transformX, -50)
      const interY = d3.interpolateNumber(transformY, -50)

      return (tRaw) => {
        const t = Math.min(tRaw * 4, 1)
        return `translate(${interX(t)}%, ${interY(t)}%)`
      }
    })
    .styleTween('width', () => {
      // first converting from px to vw
      const startingWidth =
        (100 * parseInt(container.style('width'))) / window.innerWidth
      const inter = d3.interpolateNumber(startingWidth, 80)
      return (t) => inter(t) + 'vw'
    })
    .styleTween('height', () => {
      const endHeight = window.innerHeight - 40
      const startHeight = parseInt(container.style('height'))
      const inter = d3.interpolateNumber(startHeight, endHeight)
      return (t) => inter(t) + 'px'
    })
    .on('end', () => navigate('/' + x + '/'))
}

export default expandNavigate
