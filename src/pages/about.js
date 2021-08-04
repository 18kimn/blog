/* eslint-disable max-len */
import React from 'react'
import { Grid, Typography, useMediaQuery} from '@material-ui/core'
import PageContainer from '../components/PageContainer'
import { Link } from '@gatsbyjs/reach-router'
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
          <Grid container direction='column' >
            { isLargeScreen && 
              <Grid item xs={1}></Grid>
            }
            <Grid item xs={12} md>
              <Grid container xs={12} direction='column' alignItems='center' style={{height: 'auto'}}>
                <Typography variant='body1'>
            I’m a senior at Yale College double majoring in Ethnicity, Race, & Migration as well as Statistics & Data Science.
            I am broadly interested in a critical study of space and race, especially in how actions along these dimensions can destroy or advance global imperialism.
            I have related interests in data visualization and interactive presentations. My strengths are in the R tidyverse, and I am also familiar
            with the data.table, Shiny, sf, and spatstat packages. I also have experience working in Python, Stata, Tableau, and Excel.
                </Typography>
                <br/>
                <Typography variant='body1'>
            This summer, I&apos;m working with the <Link to='https://antievictionmap.com/'>Anti-Eviction Mapping Project,</Link> a tenant organizing collective 
            and digital cartography group based out of San Francisco. I&apos;m also continuing research with Professor Emma 
            Zang of Yale Sociology and work with local New Haven nonprofit DataHaven. On campus, I am part of the Asian Students for Ethnic Studies group (formerly the
            Asian American Studies Task Force) and perform with Korean drum troup UNITY. Previously, I served as Programming Chair for the Asian American Students Alliance,
            was a Social Chair for the Korean American Students at Yale and was a Dwight Hall Urban Fellow, through which I worked at local nonprofit LEAP.
                </Typography>
                <br/>
                <Typography variant='body1'>
            You can find more information of my other activities in my <Link to='/files/resume.html'>resume</Link>,
            some of my work under the <Link to='/projects'>Projects</Link> page, and some writing about the making of this blog <Link to='/writing/about'>here</Link>.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default IndexPage
