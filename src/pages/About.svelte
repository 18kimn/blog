<script>
  import Header from '../components/Header.svelte'
</script>

<div>
  <Header selected="/about" />
  <p>
    I'm interested in departing from this colonial world and building
    an abolitionist, decolonial, communist future.
  </p>

  <table>
    <tr>
      <td>Education</td>
      <td>
        Yale College, Class of 2023 <br />
        Majors: Ethnicity, Race, & Migration; Statistics & Data Science.</td
      >
    </tr>
    <tr>
      <td>Work</td>
      <td>
        <ul>
          <li>
            <a target="_blank" href="https://www.ctdatahaven.org">
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
      </td>
    </tr>
    <tr>
      <td>Interests</td>
      <td>
        <ul>
          <li>Global theories of race</li>
          <li>Economic crises after 1973</li>
          <li>Colonial histories of the present</li>
          <li>Sustainable web development</li>
          <li>More liberatory ways to work with data</li>
          <li>Qualitative ways to explore quantitative things</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Skills</td>
      <td>
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
      </td>
    </tr>
  </table>
</div>

<style>
  div {
    max-width: 65ch;
  }

  p,
  ul {
    margin: 0;
  }

  ul {
    padding-inline: 1rem;
  }

  table {
    margin: 1rem 0;
    border-spacing: 0 1rem;
  }
  td:first-child {
    font-weight: bold;
    padding-right: 2rem;
  }
</style>
