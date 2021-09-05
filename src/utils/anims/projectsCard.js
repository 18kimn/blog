import * as d3 from 'd3'
import theme from '../../styles/Theme'

const runProjectsCardAnim = () => {
  const data = {
    nodes: Array(20)
      .fill(1)
      .map(() => ({})),
    links: [
      {source: 0, target: 1},
      {source: 2, target: 0},
      {source: 2, target: 1},
      {source: 2, target: 3},
      {source: 4, target: 3},
      {source: 4, target: 7},
      {source: 4, target: 5},
      {source: 5, target: 6},
      {source: 5, target: 7},
      {source: 7, target: 8},
      {source: 9, target: 7},
      {source: 10, target: 7},
      {source: 10, target: 11},
      {source: 11, target: 12},
      {source: 12, target: 13},
      {source: 13, target: 11},
      {source: 14, target: 13},
      {source: 15, target: 14},
      {source: 15, target: 16},
      {source: 16, target: 5},
      {source: 16, target: 17},
      {source: 17, target: 15},
      {source: 18, target: 16},
      {source: 19, target: 17},
    ],
  }

  const pxtoNum = (str) => {
    return Number(str.substring(0, str.match('px').index))
  }
  const width = pxtoNum(d3.select('.projectsCard').style('width'))
  const height = pxtoNum(d3.select('.projectsCard').style('height'))

  d3.selectAll('.projectsCardAnim').remove()
  const svg = d3
    .select('.projectsCard')
    .append('svg')
    .attr('class', 'projectsCardAnim')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('position', 'absolute')
    .style('pointer-events', 'none') // so that users can still click on the card itself

  const links = svg
    .append('g')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('class', 'link')
    .style('stroke-width', 1)
    .style('stroke', theme.palette.solarized.base1)
    .style('stroke-opacity', 0.2)

  const nodes = svg
    .append('g')
    .selectAll('circle')
    .data(data.nodes)
    .join('circle')
    .attr('class', 'node')
    .style('r', 1)
    .style('opacity', 0.5)
    .style('fill', theme.palette.solarized.base02)

  const ticked = () => {
    links
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    nodes
      .attr('cx', (d) => Math.max(0, Math.min(d.x, width)))
      .attr('cy', (d) => Math.max(0, Math.min(d.y, height)))
  }

  d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links))
    .force('charge', d3.forceManyBody(1000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', ticked)
}

export default runProjectsCardAnim
