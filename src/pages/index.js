/* eslint-disable max-len */
import React, {createElement, useContext, useState, useEffect } from 'react'
import BasicInfo from '../components/HomePageCards/BasicInfo.js'
import About from '../components/HomePageCards/About.js'
import Projects from '../components/HomePageCards/Projects.js'
import { useSpring, useSprings, useSpringRef, 
  useChain, animated } from '@react-spring/web'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../styles/CardStyles.js'
import { PageLoadContext } from '../components/Layout.js'

const IndexPage = () => {

  const theme = useTheme()
  const classes = useStyles(theme)

  const [isResized, setIsResized] = useState(false)
  const resizeTimer = () => setTimeout(() => setIsResized(true), 500)
  const timerID = resizeTimer()
  useEffect(() => {
    window && window.addEventListener('resize', () => {
      clearTimeout(timerID)
      resizeTimer()
    })
  }, [timerID])

  const pageLoadCount = useContext(PageLoadContext)
  const isLargeScreen = !useBreakpoint().md
  const anims = [
    {transform: 'translate(-50%, -105%)', transformSmall: 'translate(-50%, -50%)',
      z: 2, component: BasicInfo, 
      className: 'basicInfo', ref: useSpringRef()},
    {transform: 'translate(-105%, 5%)', transformSmall: 'translate(-50%, -155%)',
      z: 1, component: About,
      className: 'about', ref: useSpringRef()},
    {transform: 'translate(5%,  5%)', transformSmall: 'translate(-50%, 55%)',
      z: 1, component: Projects,
      className: 'projects', ref: useSpringRef()}
  ]
  
  const fadeinRef = useSpringRef() 
  const fadeinStyles = useSpring({
    ref: fadeinRef,
    from: {opacity: 0},
    to: {opacity: 1},
  })

  const animStyles = useSprings(anims.length, 
    anims.map(item => {
      return {from: {transform: 'translate(-50%, -50%)'}, 
        to: {transform: isLargeScreen ? item.transform : item.transformSmall},
        ref: item.ref}})
  )

  useChain([fadeinRef, ...anims.map(d => d.ref)], [0, .2])
  
  const animatedComponents = animStyles.map((styles, index) => (
    <animated.div key = {index} 
      className={`${classes.cardcontainer} ${anims[index].className}`}
      style={{...styles, ...fadeinStyles,
        zIndex: anims[index].z}} >
      {createElement(anims[index].component)}
    </animated.div>
  )) 

  const staticComponents = anims.map((d,i) => 
    <div className = {`${classes.cardcontainer} ${d.className}`}
      style= {{transform: isLargeScreen ? d.transform : d.transformSmall, 
        zIndex: d.z}} key={i}>
      {createElement(d.component)}
    </div>)

  return (
    <>
      { // only run the animation if it's the first visit to the page, or if the page is being resized
        // since it gets a little annoying otherwise
        // don't render anything at all if window isn't defined, since this causes some weird things with SSR
        typeof window != 'undefined' && (
          pageLoadCount < 1 || isResized ? 
            animatedComponents : 
            staticComponents
        )
      }
    </>
  )
}

export default IndexPage
