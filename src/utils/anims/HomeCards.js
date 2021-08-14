<<<<<<< Updated upstream
import React, { createElement } from 'react'
import BasicInfo from '../../components/HomePageCards/BasicInfo.js'
import About from '../../components/HomePageCards/About.js'
import Projects from '../../components/HomePageCards/Projects.js'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../../styles/CardStyles.js'
import { useSpring, useSprings, useSpringRef, 
  useChain, animated } from '@react-spring/web'

const anims = [
  {transform: 'translate(-50%, -105%)', 
    transformSmall: 'translate(-50%, -50%)',
    z: 2, component: BasicInfo, 
    className: 'basicInfo'},
  {transform: 'translate(-105%, 5%)', 
    transformSmall: 'translate(-50%, -155%)',
    z: 1, component: About,
    className: 'about'},
  {transform: 'translate(5%,  5%)',
    transformSmall: 'translate(-50%, 55%)',
    z: 1, component: Projects, className: 'projects'}
]

/* SSR is a pain in the butt with gatsby */ 
const AnimCards = ({largeScreen}) => {
  
  const theme = useTheme()
  const classes = useStyles(theme)

  const fadeinRef = useSpringRef() 
  const fadeinStyles = useSpring({
    ref: fadeinRef,
    from: {opacity: 0},
    to: {opacity: 1},
  })

  const refs = anims.map(() => useSpringRef())
  const animStyles = useSprings(anims.length, 
    anims.map((item, i)=> {
      return {from: {transform: 'translate(-50%, -50%)'}, 
        to: {transform: largeScreen ? item.transform : item.transformSmall},
        ref: refs[i]}})
  )

  useChain([fadeinRef, ...refs], [0, .2])

  return animStyles.map((styles, index) => (
    <animated.div key = {index} 
      className={`${classes.cardcontainer} ${anims[index].className}`}
      style={{...styles, ...fadeinStyles,
        zIndex: anims[index].z}} >
      {createElement(anims[index].component)}
    </animated.div>
  )) 
}

const StaticCards = ({largeScreen}) => {

  const theme = useTheme()
  const classes = useStyles(theme)

  return anims.map((d,i) => 
    <div className = {`${classes.cardcontainer} ${d.className}`}
      style= {{transform: largeScreen ? d.transform : d.transformSmall, 
        zIndex: d.z}} key={i}>
      {createElement(d.component)}
    </div>)
}

export { AnimCards, StaticCards }
=======
import React, { createElement } from 'react'
import BasicInfo from '../../components/HomePageCards/BasicInfo.js'
import About from '../../components/HomePageCards/About.js'
import Projects from '../../components/HomePageCards/Projects.js'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../../styles/CardStyles.js'
import { useSpring, useSprings, useSpringRef,
  useChain, animated } from '@react-spring/web'

const anims = [
  {transform: 'translate(-50%, -105%)',
    transformSmall: 'translate(-50%, -155%)',
    z: 2, component: BasicInfo,
    className: 'basicInfo'},
  {transform: 'translate(-105%, 5%)',
    transformSmall: 'translate(-50%, -50%)',
    z: 1, component: About,
    className: 'about'},
  {transform: 'translate(5%,  5%)',
    transformSmall: 'translate(-50%, 55%)',
    z: 1, component: Projects, className: 'projects'},
]

/* SSR is a pain in the butt with gatsby */
const AnimCards = ({largeScreen}) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const fadeinRef = useSpringRef()
  const fadeinStyles = useSpring({
    ref: fadeinRef,
    from: {opacity: 0},
    to: {opacity: 1},
  })

  const refs = anims.map(() => useSpringRef())
  const animStyles = useSprings(anims.length,
    anims.map((item, i)=> {
      return {from: {transform: 'translate(-50%, -50%)'},
        to: {transform: largeScreen ? item.transform : item.transformSmall},
        ref: refs[i]}
    }),
  )

  useChain([fadeinRef, ...refs], [0, .2])

  return animStyles.map((styles, index) => (
    <animated.div key = {index}
      className={`${classes.cardcontainer} ${anims[index].className}`}
      style={{...styles, ...fadeinStyles,
        zIndex: anims[index].z}} >
      {createElement(anims[index].component)}
    </animated.div>
  ))
}

const StaticCards = ({largeScreen}) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return anims.map((d, i) =>
    <div className = {`${classes.cardcontainer} ${d.className}`}
      style= {{transform: largeScreen ? d.transform : d.transformSmall,
        zIndex: d.z}} key={i}>
      {createElement(d.component)}
    </div>)
}

export { AnimCards, StaticCards }
>>>>>>> Stashed changes
