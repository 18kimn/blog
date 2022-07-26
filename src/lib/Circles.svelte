<script lang="ts">
  import {onMount} from 'svelte'
  import palette from '../utils/colors'

  type Circle = [number, number]
  let circles: Circle[] = []

  let clickCanvas: HTMLCanvasElement
  let hoverCanvas: HTMLCanvasElement
  $: clickContext = clickCanvas && clickCanvas.getContext('2d')
  $: hoverContext = hoverCanvas && hoverCanvas.getContext('2d')

  $: width = clickCanvas && clickCanvas.offsetWidth
  $: height = clickCanvas && clickCanvas.offsetHeight

  /** triggered on mousemove, updates circle data */
  function updateCircles(event: MouseEvent) {
    const isOverCanvas = event.target === hoverCanvas
    if (!isOverCanvas) return
    const dims: [number, number] = [event.pageX, event.pageY]
    const last = circles[circles.length - 1]
    if (!last) return circles.push(dims)

    const dist = (last[0] - dims[0]) ** 2 + (last[1] - dims[1]) ** 2
    if (dist > 15000) circles.push(dims)
    if (circles.length > 20) circles.splice(0, 1)
  }
  const colors = [
    palette.white,
    palette.blue,
    palette.purple,
    palette.red,
    palette.cyan,
  ]
  /** picks a color from the array above */
  function randomColor(array: string[]) {
    return array[Math.floor(Math.random() * array.length)]
  }

  interface Click {
    x: number
    y: number
  }
  let clicks: Click[]
  const background = {color: 'white'}
  /** checks if the circle should be added to the clicks */
  function updateClicks(event: MouseEvent) {
    const isOverCanvas = event.target === hoverCanvas
    if (!isOverCanvas) return
    const dims = {x: event.pageX, y: event.pageY}
    clicks.push({...dims})
  }

  let lastUsedColor = 'white'
  /** draws an expanding circle animation */
  function drawCircles(time: number) {
    if (!clickCanvas || !hoverContext)
      return requestAnimationFrame(drawCircles)

    hoverContext.save()
    clickContext?.save()

    clicks.forEach((click: Click, i: number) => {
      if (click.shouldDelete) {
        clickCanvas.style.background = background.color
        clicks.splice(i, 1)
        return
      }
      if (!click.startTime) {
        click.startTime = time
        const lastIndex = colors.findIndex(
          (color) => color === lastUsedColor,
        )
        const unusedColors = [
          ...colors.slice(0, lastIndex - 1),
          ...colors.slice(lastIndex + 1, colors.length),
        ]
        click.color = randomColor(unusedColors)
        lastUsedColor = click.color
        const rs = [
          [width - click.x, height - click.y],
          [click.x, click.y],
          [width - click.x, click.y],
          [click.x, height - click.y],
        ]
          .map((pts) => (pts[0] ** 2 + pts[1] ** 2) ** 0.5)
          .reduce((prev, curr) => (curr > prev ? curr : prev), 0)

        click.maxR = rs
      }

      if (!clickContext) return
      clickContext.beginPath()
      const radius = (2000 * (time - click.startTime)) / 1000
      clickContext.arc(click.x, click.y, radius, 0, 2 * Math.PI)
      clickContext.lineWidth = 5
      clickContext.fillStyle = click.color
      clickContext.fill()
      if (click.maxR < radius) {
        background.color = click.color
        click.shouldDelete = true
      }
    })

    hoverContext.clearRect(0, 0, width, height)
    circles.forEach((circle, i) => {
      if (!circle.startTime) {
        circle.startTime = time
        circle.color = randomColor(colors)
      }
      hoverContext.beginPath()
      hoverContext.arc(circle[0], circle[1], 80, 0, 2 * Math.PI)
      hoverContext.fillStyle = circle.color
      const alpha = 0.2 * (1 - (time - circle.startTime) / 1000)
      hoverContext.globalAlpha = Math.max(0, alpha)
      hoverContext.fill()
      if (Math.max(0, alpha) === 0) circles.splice(i, 1)
    })
    hoverContext.restore()

    requestAnimationFrame(drawCircles)
  }

  onMount(() => {
    document.addEventListener('mousemove', updateCircles)
    document.addEventListener('click', updateClicks)
    const ro = new ResizeObserver(() => {
      width = clickCanvas.offsetWidth
      height = clickCanvas.offsetHeight
    })
    ro.observe(clickCanvas)

    drawCircles(0)
  })
</script>

<canvas bind:this={clickCanvas} {width} {height} />
<canvas bind:this={hoverCanvas} {width} {height} />

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    height: 100%;
    width: 100%;
  }
</style>
