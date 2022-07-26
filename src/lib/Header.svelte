<script lang="ts">
  export let selected: '/' | '/about' | '/projects' | '/writing'

  const routes = [
    {path: '/', label: 'Home'},
    {path: '/about', label: 'About'},
    {path: '/projects', label: 'Projects'},
    {path: '/writing', label: 'Writing'},
  ]
</script>

<nav>
  <div id="home">
    <span>Nathan Kim</span>
  </div>
  <div id="links">
    <div class="link-container">
      {#each routes as route}
        <a class:selected={route.path === selected} href={route.path}>
          {route.label}
        </a>
      {/each}
    </div>
  </div>
</nav>

<style>
  nav {
    width: 100%;
    position: relative;
    margin: 2rem 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
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
    margin-right: 0.5rem;
    display: flex;
    place-content: center;
  }

  #links {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
  }

  .link-container {
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
    place-content: center;
  }

  a {
    margin: 0 0.5rem;
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
