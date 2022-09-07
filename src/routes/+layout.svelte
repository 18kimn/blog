<script lang="ts">
  import {page} from '$app/stores'
  import Nav from '$lib/Nav.svelte'
  import {stripHTML} from '$lib/utils/string'

  $: title = stripHTML($page.data.title || '')
</script>

<svelte:head>
  <title>{title} ⋅ Nathan Kim</title>
</svelte:head>
<div class="page">
  <Nav />
  <div class="container">
    <div class="component">
      <main>
        <slot />
      </main>
    </div>
  </div>
</div>

<style>
  @import '../globals.css';

  .page {
    width: 100%;
    max-width: 100vw;
    height: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
  }

  .component,
  .container {
    position: relative;
    display: grid;
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
  }

  .component {
    transition: opacity ease-in-out 200ms;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  main {
    position: relative;
    z-index: 1;
    height: fit-content;
    box-sizing: border-box;
    overflow-x: hidden;
  }
</style>
