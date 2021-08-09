import React, { useEffect, createContext } from 'react'
import Helmet from 'react-helmet'
import {CssBaseline} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core/styles'
import Theme from '../styles/Theme.js'
import PropTypes from 'prop-types'
import runBackgroundMap from '../utils/anims/Background.js'
import drawEllipses from '../utils/anims/Ellipse.js'
import { createMedia } from '@artsy/fresnel'
const PageLoadContext = createContext(0)
let pageLoadCount = 0

const SiteMedia = createMedia({
  breakpoints: {
    sm: 0, 
    md: 768, 
    lg: 1024, 
    xl: 1192
  }
})

const mediaStyle = SiteMedia.createMediaStyle()
const { Media, MediaContextProvider } = SiteMedia

// this will be wrapped by gatsby-ssr around everything the site renders 
const Layout = ({content}) => {

  /* this is only run on the very first load of Layout, which is when the first load of the site */
  useEffect(() => {
    runBackgroundMap()
    drawEllipses()
  }, [])

  /* this is run on every rerender of Layout, which is whenever the children update, 
      e.g. whenever a different page is navigated to 
      this way we can keep track of whether this is the first page visited to or not 
  */ 
  useEffect(() => {
    pageLoadCount += 1
  })
  
  const title = 'Nathan Kim'
  const description = 'Nathan Kim is an student at Yale University, and an aspiring researcher, web developer, and digital humanist.'
  const meta = [
    {property: 'og:title', content: title},
    {property: 'og:site_name', content: title},
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: 'summary'},
    {name: 'twitter:creator', content: '@nathanckim'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ]

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Helmet meta={meta}>
        <link rel='preconnect' href='https://fonts.googleapis.com'/>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin/>
        <link rel='preload' as='style' href='https://fonts.googleapis.com/css2?family=Fira+Code:ital,wght@0,300;0,400;0,700;1,300&display=swap'/>
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Fira+Code:ital,wght@0,300;0,400;0,700;1,300&display=swap' media='print' onLoad='this.media="all"'/>
        <style type='text/css'>{mediaStyle}</style>
      </Helmet>
      <MediaContextProvider>
        <PageLoadContext.Provider value={pageLoadCount}>
          {content}
        </PageLoadContext.Provider>
      </MediaContextProvider>
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

export { PageLoadContext, Media } 
export default Layout
