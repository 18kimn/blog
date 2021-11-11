import {geoEquirectangular, geoPath} from 'd3-geo'
import {timer} from 'd3-timer'
import {json} from 'd3-fetch'
import {select} from 'd3-selection'
import 'd3-transition'
import * as topojson from 'topojson-client'
import theme from '../../styles/Theme'

const runBackgroundMap = () => {
  // setup
  let dims = [window.innerWidth, window.innerHeight]

  select('.background').remove()
  const svg = select('#gatsby-focus-wrapper')
    .append('svg')
    .attr('width', dims[0])
    .attr('height', dims[1])
    .attr('class', 'background')
    .style('left', 0)
    .style('top', 0)
    .style('position', 'absolute')
    .style('background-color', theme.palette.solarized.base3)
    .style('z-index', 0)

  const projection = geoEquirectangular()
    .center([-72.9279, 41.3083])
    .scale(2000000) // kinda ridiculous!
    .translate([dims[0] / 2, dims[1] / 2])

  window.addEventListener('resize', () => {
    dims = [window.innerWidth, window.innerHeight]
    svg.attr('width', dims[0]).attr('height', dims[1])
    projection.translate([dims[0] / 2, dims[1] / 2])
  })

  const path = geoPath().projection(projection)

  // async data load so content can be loaded before the animation
  json('/nhv_blocks.json')
    .then((nhvBlocks) => {
      // adding and styling data
      const backgroundMap = svg
        .append('path')
        .datum(topojson.mesh(nhvBlocks))
        .attr('d', path)
        .attr('class', 'nhv-blocks')
        .style('fill', 'none')
        .style('stroke', theme.palette.solarized.base03)
        .style('opacity', 0)
        .style('stroke-width', 2)
        .style('stroke-dasharray', '100 10')

      backgroundMap.transition().duration(500).style('opacity', 0.1)

      timer((elapsed) => {
        backgroundMap.style('stroke-dashoffset', elapsed / 75)
      })
    })
    .catch((error) => console.log(error))
}

export default runBackgroundMap
