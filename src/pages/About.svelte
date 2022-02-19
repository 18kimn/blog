<script>
  import Header from '../components/Header.svelte'

  /* the markup is a lot but it's kind of needed since the content
 is a bit variable*/
</script>

<div class="wrapper">
  <Header selected="/about" />
  <p>
    I'm interested in departing from this colonial world and building
    an abolitionist, decolonial, communist future.
  </p>

  <div id="container">
    <div class="row">
      <span class="topic">Education</span>
      <span class="content">
        Yale College, Class of 2023 <br />
        Majors: Ethnicity, Race, & Migration; Statistics & Data Science.
      </span>
    </div>
    <div class="row">
      <span class="topic">Work</span>
      <span class="content">
        <ul>
          <li>
            <a target="_blank" href="https://www.cspanatahaven.org">
              DataHaven
            </a>
          </li>
          <li>
            <a target="_blank" href="https://antievictionmap.com">
              The Anti-Eviction Mapping Project
            </a>
          </li>
          <li>
            <a target="_blank" href="http://www.emmazang.net">
              Research with Prof. Emma Zang (Sociology)
            </a>
          </li>
        </ul>
      </span>
    </div>
    <div class="row">
      <span class="topic">Interests</span>
      <span class="content">
        <ul>
          <li>Global theories of race</li>
          <li>Economic crises after 1973</li>
          <li>Colonial histories of the present</li>
          <li>Sustainable web development</li>
          <li>More liberatory ways to work with data</li>
          <li>Qualitative ways to explore quantitative things</li>
        </ul>
      </span>
    </div>
    <div class="row">
      <span class="topic">Skills</span>
      <span class="content">
        <ul>
          <li>Svelte, React, Vue</li>
          <li>d3.js</li>
          <li>
            Maps: Leaflet, Mapbox GL, the sf package in R,
            OpenStreetMap, ESRI, QGIS
          </li>
          <li>Data handling: the R tidyverse, plus some NodeJS</li>
          <li>Linear modeling</li>
          <li>Linux things</li>
        </ul>
      </span>
    </div>
  </div>
</div>

<style>
  p,
  ul {
    margin: 0;
  }

  ul {
    padding-inline: 1rem;
  }

  .wrapper {
    max-width: 100%;
  }

  div {
    margin: 1rem 0;
    border-spacing: 0 1rem;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
  }

  .topic {
    flex-basis: 15ch;
    font-weight: bold;
    margin: 1rem 0 0.5rem 0;
  }

  .content {
    flex: 1;
    min-width: min(30ch, 100%);
  }
</style>
