<script lang="ts">
  import {onMount} from 'svelte'

  let circles = []

  let canvas: HTMLCanvasElement
  $: context = canvas && canvas.getContext('2d')

  let width = window.innerWidth
  let height = window.innerHeight

  /** triggered on mousemove, updates circle data */
  function updateCircles(event) {
    const dims = [event.offsetX, event.offsetY]
    const last = circles[circles.length - 1]
    if (!last) return circles.push(dims)
    const dist = (last[0] - dims[0]) ** 2 + (last[1] - dims[1]) ** 2
    if (dist > 20000) circles.push(dims)
    if (circles.length > 20) circles.splice(0, 1)
  }

  /** actually animates the circles */
  function drawCircles(time: number) {
    if (!canvas || !context) return requestAnimationFrame(drawCircles)
    context.save()
    context.clearRect(0, 0, width, height)
    circles.forEach((circle) => {
      if (!circle.startTime) circle.startTime = time
      context.beginPath()
      context.arc(circle[0], circle[1], 80, 0, 2 * Math.PI)
      context.fillStyle = 'black'
      context.globalAlpha = Math.max(
        0,
        1 - (time - circle.startTime) / 1000,
      )
      context.fill()
    })
    context.restore()
    requestAnimationFrame(drawCircles)
  }

  onMount(() => {
    document.addEventListener('mousemove', updateCircles)
    document.addEventListener('resize', () => {
      width = window.innerWidth
      height = window.innerHeight
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
    height: 100%;
    width: 100%;
  }
</style>
