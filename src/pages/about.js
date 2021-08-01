/* eslint-disable max-len */
import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import PageContainer from '../components/PageContainer'

const IndexPage = () => {

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Grid container direction='column' justifyContent='center' alignItems='center'>
            <Typography variant='h1'>Nathan Kim</Typography>
            <Typography variant='h2'>Yale College Class of 2022</Typography>
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container direction='column' alignItems='center'>
            <Grid item xs={1}></Grid>
            <Typography variant='body1'>
            I’m a junior at Yale College double majoring in Ethnicity, Race, & Migration as well as Statistics & Data Science.
            I am broadly interested in a critical study of space and race, especially in how actions along these dimensions can destroy or advance global imperialism.
            I have related interests in data visualization and interactive presentations. My strengths are in the R tidyverse, and I am also familiar
            with the data.table, Shiny, sf, and spatstat packages. I also have experience working in Python, Stata, Tableau, and Excel.
            </Typography>
            <br/>
            <Typography variant='body1'>
            I work as a research assistant with Professor Emma Zang through the Yale Institution for Social and Policy Studies, and am an
            intern with local New Haven nonprofit DataHaven. On campus, I am part of the Asian Students for Ethnic Studies group (formerly the
            Asian American Studies Task Force) and perform with Korean drum troup UNITY. Previously, I served as Programming Chair for the Asian American Students Alliance,
            was a Social Chair for the Korean American Students at Yale and was a Dwight Hall Urban Fellow, through which I worked at local nonprofit LEAP.
            </Typography>
            <br/>
            <Typography variant='body1'>
            You can find more information of my other activities in my CV, and some of my work under the Portfolio tab.
            </Typography>
          </Grid>
        </Grid>
      </Grid>=
    </PageContainer>
  )
}

export default IndexPage
