import {
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
} from 'd3-force'
/* simple force network to add some spice */

const N_NODES = 100

const nodeColors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
]

type Node = {id: number; group: number}
type Link = {source: number; target: number}

function generateGraph() {
  const randInt = () => Math.floor(Math.random() * 5)
  const nodes: Node[] = Array(N_NODES)
    .fill(0)
    .map((_, i) => ({group: randInt(), id: i}))

  const links: Link[] = []

  const grouped = nodes.reduce((prev, curr) => {
    if (prev[curr.group]) {
      prev[curr.group].push(curr)
    } else {
      prev[curr.group] = [curr]
    }
    return prev
  }, [] as Node[][])

  // within-group links
  nodes.forEach((_, i) => {
    const n = Math.floor(Math.random() * 6)
    Array(n)
      .fill(0)
      .forEach(() => {
        // prefer links between nodes in same group
        const group = grouped[nodes[i].group]
        links.push({
          source: i,
          target: randomItem(group).id,
        })
      })
  })

  function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  // inter-group links
  grouped.forEach((group) => {
    grouped.forEach((targetGroup) => {
      const source = randomItem(group).id
      const target = randomItem(targetGroup).id
      links.push({source, target})
    })
  })

  return {
    nodes,
    links,
  }
}

function drawFrame(
  {nodes, links},
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  context.save()
  context.clearRect(0, 0, width, height)
  // Draw links
  context.strokeStyle = '#000000'
  context.lineWidth = 0.5
  links.forEach((d) => {
    if (!(d.source['x'] && d.source['y'])) return
    context.beginPath()
    context.moveTo(d.source['x'], d.source['y'])
    context.lineTo(d.target['x'], d.target['y'])
    context.stroke()
  })
  // Draw nodes
  nodes.forEach((d) => {
    context.beginPath()
    // Node fill
    context.moveTo(d.x, d.y)
    context.arc(d.x, d.y, 5, 0, 2 * Math.PI)
    context.fillStyle = nodeColors[d.group]
    context.fill()
    // Node outline
    context.strokeStyle = '#fff'
    context.stroke()
  })
  context.restore()
}

export default function makeNetwork(
  canvas: HTMLCanvasElement,
) {
  const context = canvas.getContext('2d')
  const {nodes, links} = generateGraph()

  const width = canvas.offsetWidth
  const height = canvas.offsetHeight

  const simulation = forceSimulation(nodes)
    .force('center', forceCenter(width / 2, height / 2))
    .force('charge', forceManyBody().strength(-100))
    .force('link', forceLink(links).strength(0.2))
    .force('x', forceX(width / 2).strength(0.05))
    .force('y', forceY(height / 2).strength(0.05))

  simulation.on('tick', () =>
    drawFrame({nodes, links}, context, width, height),
  )
}
