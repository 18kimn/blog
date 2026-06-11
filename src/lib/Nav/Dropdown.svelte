<script lang="ts">
  import {page} from '$app/state'
  import {resolve} from '$app/paths'
  import {isCurrent} from '$lib/utils/misc'
  import {onMount} from 'svelte'

  let {
    label,
    subroutes,
  }: {label: string; subroutes: readonly string[]} =
    $props()

  let isOpen = $state(false)

  let containerDiv: HTMLElement
  onMount(() => {
    const onBodyClick = (e: MouseEvent) => {
      if (!containerDiv) return
      if (!containerDiv.contains(e.target as HTMLElement)) {
        isOpen = false
      }
    }
    document.body.addEventListener('click', onBodyClick)
    return () =>
      document.body.removeEventListener(
        'click',
        onBodyClick,
      )
  })
</script>

<div
  class="container"
  bind:this={containerDiv}
  onmouseenter={() => (isOpen = true)}
  onmouseleave={() => (isOpen = false)}
  role="presentation"
>
  <button
    class="top"
    class:open={isOpen}
    aria-haspopup="true"
    aria-expanded={isOpen}
    onclick={() => (isOpen = !isOpen)}
  >
    {label}
  </button>

  <div class="subroutes" class:open={isOpen} role="menu">
    {#each subroutes as subroute (subroute)}
      <a
        role="menuitem"
        class:selected={isCurrent(
          subroute,
          page.url.pathname,
        )}
        href={resolve(`/${subroute}`)}
        onclick={() => (isOpen = false)}
      >
        {subroute}
      </a>
    {/each}
  </div>

  <span class="spacer">⋅</span>
</div>

<style>
  .container {
    position: relative;
    display: inline-flex;
    font-size: 1.2rem;
    place-items: flex-end;
  }

  .top {
    z-index: 20;
    position: relative;
    font-size: 1.2rem;
    color: black;
    padding: 0;
    line-height: inherit;
    display: inline-flex;
    align-items: baseline;
    gap: 0.25rem;
    transition: color ease-in-out 400ms;
  }

  .top:hover,
  .top.open {
    color: var(--color);
  }

  .spacer {
    margin: 0 0.5rem;
  }

  .subroutes {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    min-width: max-content;
    padding: 0.4rem 0;
    background: var(--bg);
    border: var(--border);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(17, 0, 217, 0.12);
    opacity: 0;
    transform: translateY(-0.25rem);
    pointer-events: none;
    transition:
      opacity 200ms ease-in-out,
      transform 200ms ease-in-out;
  }

  .subroutes::before {
    content: '';
    position: absolute;
    top: -0.4rem;
    left: 0;
    right: 0;
    height: 0.4rem;
  }

  .subroutes.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .subroutes a {
    display: block;
    padding: 0.25rem 1rem;
    color: black;
    text-decoration: none;
    white-space: nowrap;
    transition: color ease-in-out 400ms;
  }

  .subroutes a:hover {
    color: var(--color);
  }

  .subroutes a.selected {
    font-weight: bold;
  }
</style>
