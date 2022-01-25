<script>
  export let selected = '/'

  const routes = [
    {path: '/', label: 'Home'},
    {path: '/about', label: 'About'},
    {path: '/projects', label: 'Projects'},
    {path: '/blog', label: 'Blog'},
  ]
</script>

<nav>
  <span id="home">Nathan Kim</span>
  <div>
    {#each routes as route}
      <a class:selected={route.path === selected} href={route.path}
        >{route.label}</a
      >
    {/each}
  </div>
</nav>

<style>
  nav {
    width: 100%;
    position: relative;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selected {
    font-weight: bold;
  }


  nav::after {
    bottom: -1rem;
    left: 10%;
    width: 80%;
  }

  #home {
    font-size: 1.5rem;
    font-weight: bold;
  }

  a {
    margin-right: 1rem;
    color: black;
    text-decoration: none;
    transition: all ease-in-out 0.4s;
    position: relative;
  }

  a:hover {
    opacity: 0.4;
  }

  a:hover::after {
    left: 10%;
    width: 80%;
  }
</style>
