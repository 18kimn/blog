<script lang="ts">
  import {onMount} from 'svelte'
  import {page} from '$app/state'
  import {resolve} from '$app/paths'
  import {isCurrent} from '$lib/utils/misc'
  import Dropdown from './Dropdown.svelte'

  const routes = [
    '',
    {blog: ['writing', 'projects', 'pics', 'guestbook']},
    'cv',
    'press',
  ] as const

  onMount(() => {
    /* below is for header ::after animation */
    ;(
      document.querySelector('.header') as HTMLElement
    )?.style?.setProperty('--header-border-width', '100%')
  })
</script>

<div class="header-container no-print">
  <div class="header">
    <a href={resolve('/')}>
      {#if page.url.pathname === '/'}
        <h1>Nathan Kim</h1>
      {:else}
        <h2>Nathan Kim</h2>
      {/if}
    </a>
    <nav class="links">
      {#each routes as route (route)}
        {#if typeof route === 'string'}
          <a
            class={isCurrent(route, page.url.pathname) &&
              'selected'}
            href={resolve(`/${route}`)}
          >
            {route === '' ? 'home' : route}
          </a>
          <span class="spacer">⋅</span>
        {:else}
          <Dropdown
            label={Object.keys(route)[0]}
            subroutes={Object.values(route)[0]}
          />
        {/if}
      {/each}
    </nav>
  </div>
</div>

<style>
  .header-container {
    padding: 1rem 0;
    box-sizing: border-box;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-end;
    box-sizing: border-box;
    position: relative;
    gap: 1rem;
    --header-border-width: 0;
  }

  .header a {
    text-decoration: none;
  }

  .header::after {
    position: absolute;
    bottom: 0;
    height: 1px;
    background-color: gray;
    content: '';
    left: 0;
    width: var(--header-border-width);
    transition: all ease-in-out 0.5s;
  }

  h1,
  h2 {
    font-size: 3rem;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    place-items: flex-end;
    padding: 0;
  }

  a {
    color: black;
    transition: color ease-in-out 400ms;
    font-size: 1.2rem;
    position: relative;
    z-index: 20;
  }

  a:hover {
    color: var(--color);
  }

  .selected {
    font-weight: bold;
  }

  .spacer {
    margin: 0 0.5rem;
  }

  .spacer:last-child {
    display: none;
  }
</style>
