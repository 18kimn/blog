<script lang="ts">
  import Header from '../components/Header.svelte'
  import {onMount} from 'svelte'

  let projects: []

  onMount(async () => {
    projects = await fetch('/projects.json').then((res) => res.json())
    projects = Object.entries(projects)
      .map((project) => {
        project[1].date = new Date(project[1].date)
        return project
      })
      .sort((a, b) => b[1].date - a[1].date)
  })
</script>

<Header selected="/projects" />

<div>
  {#if !projects || projects.length === 0}
    Loading...
  {:else}
    {#each projects as project}
      <p>
        <span class="date">{project[1].date.toDateString()}:</span>
        <a href={project[0]}>{project[1].title}</a>
      </p>
    {/each}
  {/if}
</div>

<style>
  .date {
    width: 15ch;
  }

  p {
    display: flex;
    justify-content: flex-start;
  }
</style>
