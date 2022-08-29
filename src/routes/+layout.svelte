<script lang="ts">
  import {page} from '$app/stores'
  import Nav from '$lib/Nav.svelte'
</script>

<svelte:head>
  {#if $page.data?.title}
    <title>{$page.data.title} ⋅ Nathan Kim</title>
  {/if}
</svelte:head>
<div class="page">
  <Nav />
  <div id="container">
    <div id="component">
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

  #component,
  #container {
    position: relative;
    display: grid;
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
  }

  #component {
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
