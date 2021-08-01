import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import useStyles from '../styles/PageStyles'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

// this component is a layout component -- it makes sure content is centered on the page, 
// on a MUI paper component with a decent amount of shadow
// it also helps save a few lines of nesting elements everywhere
const PageContainer = ({children}) => {

  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Grid container alignItems='center' justifyContent='center' className={classes.pageContainer}>
      <Grid item className={classes.page}>
        <Paper elevation={5} className={classes.pageContent}>
          {children}
        </Paper>
      </Grid>
    </Grid>
  )
}

PageContainer.propTypes = {
  children: PropTypes.element
}

export default PageContainer