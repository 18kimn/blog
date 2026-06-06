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

  let isClicked = $state(false)

  let containerDiv: HTMLElement
  onMount(() => {
    document
      .querySelector('body')
      .addEventListener('click', (e) => {
        if (!containerDiv) return
        if (
          !containerDiv.contains(e.target as HTMLElement)
        ) {
          isClicked = false
        }
      })
  })
</script>

<div
  class="container"
  bind:this={containerDiv}
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      isClicked = !isClicked
    }
  }}
  onclick={() => {
    isClicked = !isClicked
  }}
>
  <button class="top" aria-haspopup="true">
    {label}
    <span class="spacer">⋅</span>
  </button>
  <div
    class="subroutes"
    style={`min-width: ${label.length}ch; min-height: 1rem; ${isClicked ? 'opacity: 1' : ''}`}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        isClicked = !isClicked
      }
    }}
    onclick={() => {
      isClicked = !isClicked
    }}
  >
    {#each subroutes as subroute (subroute)}
      <a
        class={isCurrent(subroute, page.url.pathname) &&
          'selected'}
        href={resolve(`/${subroute}`)}
      >
        {subroute}
      </a>
    {/each}
  </div>
</div>

<style>
  .container {
    position: relative;
    display: inline-block;
    font-size: 1.2rem;
  }

  .spacer {
    margin: 0 0.5rem;
  }

  .top {
    z-index: 20;
    position: relative;
  }

  button {
    font-size: 1.2rem;
  }

  .subroutes {
    position: absolute;
    top: calc(100% - 0.5rem);
    left: 0;
    padding-top: 0.5rem;
    z-index: 10;
    background: #fff3f3;
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    padding: 0.5rem 1rem 0.5rem 0.2rem;
    border: solid 1px gray;
    border-top: none;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .container:hover .subroutes {
    opacity: 1;
  }

  a {
    display: block;
    text-decoration: none;
  }
</style>
