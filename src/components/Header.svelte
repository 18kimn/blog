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
    margin: 2rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .selected {
    font-weight: bold;
  }

  #home {
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

  nav::after,
  a::after {
    position: absolute;
    bottom: -5px;
    height: 1px;
    background-color: gray;
    content: '';
    left: 50%;
    width: 0%;
    transition: all ease-in-out 0.2s;
  }

  a:hover::after {
    left: 10%;
    width: 80%;
  }

  nav::after {
    position: absolute;
    bottom: -1rem;
    left: 10%;
    width: 80%;
  }
</style>
