<script lang="ts">
  import {onMount} from 'svelte'
  import Router, {navigate} from './components/Router.svelte'
  import Home from './pages/Home.svelte'
  import About from './pages/About.svelte'
  import Projects from './pages/Projects.svelte'

  onMount(() => {
    /* don't let browser do a full reload */
    document.addEventListener('click', (event) => {
      const target = event.target || event.srcElement
      if (!target.tagName === 'A') return
      if (target.host !== window.location.host) return
      event.preventDefault()
      navigate(target.pathname)
    })
  })

  const routes = {
    '/': () => Home,
    '/about': () => About,
    '/projects': () => Projects,
  }
</script>

<Router {routes} />
