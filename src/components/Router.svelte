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
  window.onpopstate = () => LoadRoute(location.pathname)
</script>

<script lang="ts">
  import {onMount} from 'svelte'
  import type {SvelteComponent} from 'svelte/internal'
  import {fade} from 'svelte/transition'
  import Circles from './Circles.svelte'

  let component: SvelteComponent
  export let routes = {}

  LoadRoute = async (path: string) => {
    const current = getRoute(path)
    component = current.component()
    console.log(current)
    props = getProps(path, current.segments)
  }

  onMount(() => {
    _routes = getRouteSegments(routes)
    LoadRoute(location.pathname)
  })
</script>

<div id="container">
  <Circles />
  {#key component}
    <div
      class="component"
      in:fade={{duration: 150, delay: 150}}
      out:fade={{duration: 150, delay: 0}}
    >
      <main>
        <svelte:component this={component} {...props} />
      </main>
    </div>
  {/key}
</div>

<style>
  .component,
  #container {
    position: relative;
    display: grid;
    place-items: center;
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
    height: 100%;
  }

  main {
    position: relative;
    z-index: 1;
    background: white;
    box-shadow: 10px 10px;
    border: black solid 1px;
    border-radius: 0.5rem;
    place-content: center;
    place-items: center;
    height: unset;
    width: fit-content;
    max-width: min(100vw, 65ch);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 1rem;
  }
</style>
