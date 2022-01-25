<script context="module" lang="ts">
  let _routes = {}
  let props = {}

  let LoadRoute = () => null

  /** Useful for variable paths of form /:post
   * @returns Array of form {path, component, segments: {name, variable}}
   */
  function getRouteSegments(routes) {
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

  const getRoute = (path) => {
    const segments = path.replace(/^\/+|\/+$/g, '').split('/')
    return _routes.find((route) => {
      if (route.segments.length !== segments.length) return false
      return segments.every(
        (s, i) =>
          route.segments[i].name === s || route.segments[i].variable,
      )
    })
  }

  /** retrieve the correct set of props passed to the component
   * (mostly unnecessary)
   */
  function getProps(path: string, routeSegments) {
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
  import {fade} from 'svelte/transition'

  let component
  export let routes = {}

  LoadRoute = async (path: string) => {
    const current = getRoute(path)
    component = await current.component()
    console.log(current)
    props = getProps(path, current.segments)
  }

  onMount(() => {
    _routes = getRouteSegments(routes)
    console.log(LoadRoute)
    LoadRoute(location.pathname)
  })
</script>

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

<style>
  .component {
    display: grid;
    place-content: center;
    grid-column: 1/2;
    grid-row: 1/2;
  }
</style>
