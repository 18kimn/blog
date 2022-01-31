<script lang="ts">
  import Header from '../components/Header.svelte'
  import {onMount} from 'svelte'

  interface Project {
    name: string
    title: string
    subtitle: string
    content: string
    date: Date
  }
  let projects: Project[]

  onMount(async () => {
    projects = await fetch('/projects.json').then((res) => res.json())
    projects = projects
      .map((project) => {
        project.date = new Date(project.date)
        return project
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  })
</script>

<div id="container">
  <Header selected="/projects" />

  <div id="list">
    {#if !projects}
      Loading...
    {:else}
      {#each projects as project}
        <p>
          <span class="date">
            {project.date.toISOString().slice(0, 10)}:
          </span>
          <span class="content">
            <a id={project.name} href={project.name}>
              {project.title}
            </a>
            <br />
            <span class="subtitle">
              {project.subtitle || ''}
            </span>
          </span>
        </p>
      {/each}
    {/if}
  </div>
</div>

<style>
  #container {
    overflow: auto;
    width: 100%;
  }

  .date {
    min-width: 10ch;
    margin-right: 1rem;
    text-align: right;
  }

  #list {
    width: min(100vw, 47ch);
    display: grid;
  }

  p {
    display: flex;
    justify-content: flex-start;
    margin: 0.5rem 0;
  }

  a {
    color: black;
    text-decoration: underline;
    cursor: pointer;
  }

  a:hover {
    font-weight: bold;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  /** force empty spans to still have height */
  .subtitle:before {
    content: '\200b';
  }
</style>
