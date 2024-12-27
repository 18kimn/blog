<script lang="ts">
  import {run} from 'svelte/legacy'
  import OutLink from './OutLink.svelte'

  interface Props {
    /* when content inside changes, resizes height
  with transition */
    content: {info: string; link?: string}
  }

  let {content}: Props = $props()

  let height = $state(0)
  let inner: HTMLSpanElement = $state()

  function resize() {
    // setTimeout forces it to happen after a paint
    setTimeout(() => {
      height = inner.offsetHeight
    }, 0)
  }

  console.log('test')

  run(() => {
    content !== null && resize()
  })
</script>

<div class="box" style="height: {height}px">
  <span bind:this={inner}>
    {content?.info || ''}
    {#if content?.link}
      <OutLink href={content.link}>
        {content.link}
      </OutLink>
    {/if}
  </span>
</div>

<style>
  .box {
    overflow: hidden;
    transition: height ease-in-out 300ms;
    transition-delay: 30ms;
  }
</style>
