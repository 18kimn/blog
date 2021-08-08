/* eslint-disable max-len */
import React from 'react'
import { Grid, Typography, useMediaQuery} from '@material-ui/core'
import PageContainer from '../components/PageContainer'
import { Link } from '@gatsbyjs/reach-router'

const links = [
  {name: 'Resume', value: '/files/resume.html'},
  {name: 'Projects', value: '/projects/'},
  {name: 'Making this site', value: '/writing/about/'}
]
const IndexPage = () => {

  const isLargeScreen = useMediaQuery('(min-width:800px)')

  return (
    <PageContainer>
      <Grid container direction='row' spacing={2} style={{height: isLargeScreen ? '100%' : 'auto'}}>
        <Grid item xs={12} md={5}>
          <Grid container direction='column' justifyContent='center' alignItems='center' style={{textAlign: 'center'}}>
            <Typography variant='h1'>Nathan Kim</Typography>
            <Typography variant='h2'>Yale College Class of 2022</Typography>
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container direction='column' alignItems='center' justifyContent='center'>
            <Typography variant='body1'>
            I’m a senior at Yale College double majoring in Ethnicity, Race, & Migration as well as Statistics & Data Science.
            I am broadly interested in a critical study of space and race, especially in how actions along these dimensions can destroy or advance global imperialism.
            I have related interests in data visualization and interactive presentations. My strengths are in the R tidyverse and d3.js, and I also have experience working in Python, Stata, Tableau, and Excel.
            </Typography>
            <br/>
            <Typography variant='body1'>
            This summer, I&apos;m working with the <Link to='https://antievictionmap.com/'>Anti-Eviction Mapping Project,</Link> a tenant organizing collective 
            and digital cartography group based out of San Francisco. I&apos;m also continuing research with Professor Emma 
            Zang of Yale Sociology and work with local New Haven nonprofit DataHaven. 
            </Typography>
            <br/>
            <Typography variant='body1'>
                Useful links:<br/>
              {links.map((info, i) => 
                <Link key={i} to={info.value}>
                  {info.name}<br/>
                </Link>)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default IndexPage
