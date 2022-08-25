<script lang="ts">
  /* when content inside changes, resizes height
  with transition */
  export let content: string

  let height = 0
  let inner: HTMLSpanElement

  function resize() {
    setTimeout(() => {
      height = inner.offsetHeight
    }, 0)
  }

  $: content !== null && resize()
</script>

<div class="box" style="height: {height}px">
  <span bind:this={inner}>{content || ''}</span>
</div>

<style>
  .box {
    overflow: hidden;
    transition: height ease-in-out 300ms;
    transition-delay: 30ms;
  }
</style>
