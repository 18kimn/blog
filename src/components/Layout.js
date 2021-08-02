import React, { useEffect } from 'react'
import Helmet from 'react-helmet'
import {CssBaseline} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core/styles'
import Theme from '../styles/Theme.js'
import PropTypes from 'prop-types'
import runBackgroundMap from '../utils/anims/Background.js'
import drawEllipses from '../utils/anims/Ellipse.js'

// this will be wrapped by gatsby-ssr around everything the site renders 
const Layout = ({content}) => {

  useEffect(() => {
    runBackgroundMap()
    drawEllipses()
  }, [])
  
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Helmet>
        <link rel='preconnect' href='https://fonts.googleapis.com'/>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin/>
        <link rel='preload' as='style' href='https://fonts.googleapis.com/css2?family=Fira+Code:ital,wght@0,300;0,400;0,700;1,300&display=swap'/>
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Fira+Code:ital,wght@0,300;0,400;0,700;1,300&display=swap' media='print' onLoad='this.media="all"'/>
      </Helmet>
      {content}
    </ThemeProvider>
  )
}

Layout.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  })
}

export default Layout

