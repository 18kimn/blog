<script lang="ts">
  import {onMount} from 'svelte'
  import palette from '../utils/colors'
  let circles = []

  let canvas: HTMLCanvasElement
  $: context = canvas && canvas.getContext('2d')

  $: width = canvas && canvas.offsetWidth
  $: height = canvas && canvas.offsetHeight

  /** triggered on mousemove, updates circle data */
  function updateCircles(event: MouseEvent) {
    const notOverMain = event
      .composedPath()
      .every((element: HTMLElement) => element.tagName !== 'MAIN')
    if (!notOverMain) return
    const dims = [event.offsetX, event.offsetY]
    const last = circles[circles.length - 1]
    if (!last) return circles.push(dims)
    const dist = (last[0] - dims[0]) ** 2 + (last[1] - dims[1]) ** 2
    if (dist > 20000) circles.push(dims)
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

  let clicks = []
  let background = {color: 'white'}
  /** checks if the circle should be added to the clicks */
  function updateClicks(event: MouseEvent) {
    const notOverMain = event.path.every(
      (element: HTMLElement) => element.tagName !== 'MAIN',
    )
    if (!notOverMain) return
    const dims = [event.offsetX, event.offsetY]
    clicks.push(dims)
  }

  let lastUsedColor = 'white'
  /** draws an expanding circle animation */
  function drawCircles(time: number) {
    if (!canvas || !context) return requestAnimationFrame(drawCircles)
    context.save()

    context.fillStyle = background ? background.color : 'white'
    context.fillRect(0, 0, width, height)

    clicks.forEach((click, i) => {
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
        console.log({lastIndex, unusedColors, click})
        const r1 =
          ((width - click[0]) ** 2 + (height - click[1]) ** 2) ** 0.5
        const r2 = (width ** 2 + height ** 2) ** 0.5
        click.maxR = Math.max(r1, r2)
      }
      context.beginPath()
      const radius = (2000 * (time - click.startTime)) / 1000
      context.arc(click[0], click[1], radius, 0, 2 * Math.PI)
      context.lineWidth = 5
      context.fillStyle = click.color
      context.fill()
      if (click.maxR < radius) {
        clicks.splice(i, 1)
        background = click
      }
    })

    circles.forEach((circle, i) => {
      if (!circle.startTime) {
        circle.startTime = time
        circle.color = randomColor(colors)
      }
      context.beginPath()
      context.arc(circle[0], circle[1], 80, 0, 2 * Math.PI)
      context.fillStyle = circle.color
      const alpha = 0.2 * (1 - (time - circle.startTime) / 1000)
      context.globalAlpha = Math.max(0, alpha)
      context.fill()
      if (Math.max(0, alpha) === 0) circles.splice(i, 1)
    })
    context.restore()

    requestAnimationFrame(drawCircles)
  }

  onMount(() => {
    document.addEventListener('mousemove', updateCircles)
    document.addEventListener('click', updateClicks)
    canvas.addEventListener('resize', () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
    })

    drawCircles(0)
  })
</script>

<canvas bind:this={canvas} {width} {height} />

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
