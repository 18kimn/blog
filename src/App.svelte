<script lang="ts">
  import {onMount} from 'svelte'
  import Router, {navigate} from './components/Router.svelte'
  import Home from './pages/Home.svelte'
  import About from './pages/About.svelte'
  import Post from './pages/Post.svelte'
  import Projects from './pages/Projects.svelte'
  import Writing from './pages/Writing.svelte'

  import {pages} from './store'

  onMount(async () => {
    /* don't let browser do a full reload */
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement
      const {tagName, hash, host} = target
      if (tagName !== 'A' || hash || host !== location.host) return
      event.preventDefault()
      navigate(target.pathname)
    })

    pages.set(
      await fetch('/posts.json')
        .then((res) => res.json())
        .catch((err) => err),
    )
  })
  const routes = {
    '/': () => Home,
    '/about': () => About,
    '/projects': () => Projects,
    '/writing': () => Writing,
    '/content/:type/:id': () => Post,
  }
</script>

<Router {routes} />
