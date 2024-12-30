<script lang="ts">
  import OutLink from './OutLink.svelte'

  interface Props {
    /* when content inside changes, resizes height
  with transition */
    content?: {info: string; link?: string}
    children
  }

  let {content, children}: Props = $props()

  let height = $state(0)
  let inner: HTMLSpanElement = $state()

  function resize() {
    // setTimeout forces it to happen after a paint
    setTimeout(() => {
      height = inner.offsetHeight
    }, 0)
  }

  $effect(() => {
    content !== null && resize()
    children !== null && resize()
  })
</script>

<div class="box" style="height: {height}px">
  <div bind:this={inner}>
    {#if children}
      {@render children()}
    {:else}
      {content?.info || ''}
      {#if content?.link}
        <OutLink href={content.link}>
          {content.link}
        </OutLink>
      {/if}
    {/if}
  </div>
</div>

<style>
  .box {
    overflow: hidden;
    transition: height ease-in-out 300ms;
    transition-delay: 30ms;
  }
</style>
