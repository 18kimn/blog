<script lang="ts">
  import Header from '../components/Header.svelte'
  import {onMount} from 'svelte'

  let projects: []

  onMount(async () => {
    projects = await fetch('/projects.json').then((res) => res.json())
    projects = projects
      .map((project) => {
        const date = new Date(project.date)

        const year = date.getUTCFullYear().toString()
        const month = date.getUTCMonth().toString()
        const day = date.getUTCDate().toString()
        const monthname = new Date(month).toLocaleDateString(
          navigator.languages,
          {month: 'long'},
        )

        project.date = {date, year, month, day, monthname}
        return project
      })
      .sort((a, b) => b.date.date - a.date.date)
      .reduce((prev, curr) => {
        if (!prev[curr.date.year]) {
          prev[curr.date.year] = [curr]
        } else {
          prev[curr.date.year].push(curr)
        }
        return prev
      }, {})
  })
</script>

<Header selected="/projects" />

<div id="list">
  {#if !projects}
    Loading...
  {:else}
    {#each Object.entries(projects).sort((a, b) => b[0] - a[0]) as year}
      {#each year[1] as project, i}
        <p class="row">
          <span class="year">
            {#if i === 0}
              {year[0]}
            {/if}
          </span>
          <span class="row-content">
            <span class="date">
              {project.date.monthname}&nbsp;
              {project.date.day}:
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
          </span>
        </p>
      {/each}
    {/each}
  {/if}
</div>

<style>
  .date {
    width: 12ch;
    margin-right: 1rem;
    text-align: right;
  }

  .year {
    width: 5ch;
    font-weight: bold;
  }

  .row,
  .row-content {
    display: flex;
    flex-flow: row;
  }

  .row-content {
    flex: 1;
  }

  .content {
    flex: 1;
  }

  #list {
    max-width: 100%;
  }

  p {
    display: flex;
    justify-content: flex-start;
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
  .year:before,
  .subtitle:before {
    content: '\200b';
  }
</style>
