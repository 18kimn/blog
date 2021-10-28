import React from 'react'
import {Grid, Paper, Card, CardActionArea} from '@material-ui/core'
import useStyles from '../styles/PageStyles'
import {useTheme} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {HomeOutlined, ArrowBackOutlined} from '@material-ui/icons'
import {navigate} from 'gatsby'
import {useLocation} from '@gatsbyjs/reach-router'
import {Media} from './Layout.js'

/*
  this component is a layout component --
  it makes sure content is centered on the page,
  on a MUI paper component with a decent amount of shadow
  it also helps save a few lines of nesting elements everywhere
*/
const Content = ({children}) => {
  const location = useLocation()

  const goBack = () => {
    // location.state isn't present if the
    //  page was loaded from a different domain
    // in other words this logic ensures that hitting the
    //  back button won't make the user leave the site
    location.state ? navigate(-1, {state: {backPressed: true}}) : navigate('/')
    // passing a dummy field into the state for navigate
    //  so that the home page recognizes to only render once
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <>
      <Grid
        container
        style={{
          position: 'absolute',
          top: '1rem',
          left: 'calc(100% - 5rem)',
          height: 'auto',
        }}
      >
        <Card elevation={0} style={{height: 'auto', width: 'auto'}}>
          <CardActionArea onClick={goBack}>
            <ArrowBackOutlined style={{width: '2rem', height: '2rem'}} />
          </CardActionArea>
        </Card>
        <Card elevation={0} style={{height: 'auto', width: 'auto'}}>
          <CardActionArea onClick={goHome}>
            <HomeOutlined style={{width: '2rem', height: '2rem'}} />
          </CardActionArea>
        </Card>
      </Grid>
      {children}
    </>
  )
}

const PageContainer = ({children}) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      className={classes.pageContainer}
    >
      <Grid item className={classes.page}>
        <Media greaterThanOrEqual="md">
          <Paper elevation={5} id="pageContent" className={classes.pageContent}>
            <Content>{children}</Content>
          </Paper>
        </Media>
        <Media lessThan="md">
          <Paper
            elevation={5}
            id="pageContent"
            className={classes.pageContent}
            style={{padding: '1.5rem'}}
          >
            <Content>{children}</Content>
          </Paper>
        </Media>
      </Grid>
    </Grid>
  )
}

PageContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

export default PageContainer
