<script context="module" lang="ts">
  interface Route {
    [key: string]: () => SvelteComponent
  }
  interface RouteSegments {
    path: string
    component: () => SvelteComponent
    segments: {
      name: string
      variable: boolean
    }[]
  }

  let _routes: RouteSegments[] = []
  let props = {}

  let LoadRoute = async (path: string) => {
    path
    console.log('test')
  }
  /** see https://javascript.plainenglish.io/how-to-create-a-router-in-svelte-ce66c10275fe */
  /** Useful for variable paths of form /:post
   */
  function getRouteSegments(routes: Route): RouteSegments[] {
    return Object.entries(routes).map(([path, component]) => ({
      path,
      component,
      segments: path
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .map((segment) => ({
          name: segment.replace(':', ''),
          variable: segment.startsWith(':'),
        })),
    }))
  }

  const getRoute = (path: string) => {
    const segments = path.replace(/^\/+|\/+$/g, '').split('/')
    return _routes.find((route) => {
      if (route.segments.length !== segments.length) return false
      return segments.every(
        (s, i) =>
          route.segments[i].name === s || route.segments[i].variable,
      )
    })
  }

  /** translate a URL to props */
  function getProps(
    path: string,
    routeSegments: RouteSegments['segments'],
  ) {
    let props = {}
    const segments = path.replace(/^\/+|\/+$/g, '').split('/')
    segments.map(
      (s, i) =>
        routeSegments[i].variable &&
        (props[routeSegments[i].name] = s),
    )
    return props
  }

  /** navigates to the given route
   */
  export function navigate(path: string) {
    window.history.pushState(null, null, path)
    LoadRoute(path)
  }

  window.onpopstate = () => {
    if (location.hash) return
    LoadRoute(location.pathname)
  }
</script>

<script lang="ts">
  import {onMount} from 'svelte'
  import type {SvelteComponent} from 'svelte/internal'
  import Circles from './Circles.svelte'

  export let routes = {}
  let onScreen: SvelteComponent
  let wrapper: HTMLElement

  /** short wrapper for delaying async-awaitly */
  async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  LoadRoute = async (path: string) => {
    const current = getRoute(path)
    if (!wrapper) {
      onScreen = current.component()
      props = getProps(path, current.segments)
      return
    }

    wrapper.classList.remove('intro')
    wrapper.classList.add('outro')
    await delay(200)

    wrapper.classList.remove('outro')
    wrapper.classList.add('intro')
    onScreen = current.component()
    props = getProps(path, current.segments)
    await delay(200)

    wrapper.classList.remove('intro')
  }

  onMount(() => {
    _routes = getRouteSegments(routes)
    LoadRoute(location.pathname)
  })
</script>

<div id="container">
  <Circles />
  <div id="component" class="outro intro" bind:this={wrapper}>
    <main>
      {#key onScreen}
        <svelte:component this={onScreen} {...props} />
      {/key}
    </main>
  </div>
</div>

<style>
  #component,
  #container {
    position: relative;
    display: grid;
    place-items: center;
    grid-column: 1/2;
    grid-row: 1/2;
  }

  #component {
    width: fit-content;
    max-width: min(100%, 65ch);
    height: fit-content;
    margin: 3%;
    transition: opacity ease-in-out 200ms;
    box-sizing: border-box;
  }

  .outro {
    opacity: 0;
  }

  .intro {
    opacity: 1;
  }

  main {
    position: relative;
    z-index: 1;
    background: white;
    border: solid 1px black;
    padding: 5%;
    box-shadow: 5px 5px;
    border-radius: 0.5rem;
    height: fit-content;
    box-sizing: border-box;
  }
</style>
