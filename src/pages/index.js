/* eslint-disable max-len */
import React, {createElement} from 'react'
import BasicInfo from '../components/cards/BasicInfo.js'
import About from '../components/cards/About.js'
import Portfolio from '../components/cards/Portfolio.js'
import { useSpring, useSprings, useSpringRef, useChain, animated } from '@react-spring/web'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../styles/CardStyles.js'
import { useLocation } from '@gatsbyjs/reach-router'

const IndexPage = () => {

  const theme = useTheme()
  const classes = useStyles(theme)

  const anims = [
    {transform: 'translate(-50%, -105%)', z: 2, component: BasicInfo, className: 'basicInfo', ref: useSpringRef()},
    {transform: 'translate(-105%, 5%)', z: 1, component: About, className: 'about', ref: useSpringRef()},
    {transform: 'translate(5%,  5%)', z: 1, component: Portfolio, className: 'portfolio', ref: useSpringRef()}
  ]
  
  const fadeinRef = useSpringRef() 
  const fadeinStyles = useSpring({
    ref: fadeinRef,
    from: {opacity: 0},
    to: {opacity: 1},
  })

  const animStyles = useSprings(anims.length, 
    anims.map(item => (
      {from: {transform: 'translate(-50%, -50%)'}, 
        to: {transform: item.transform},
        ref: item.ref}))
  )

  useChain([fadeinRef, ...anims.map(d => d.ref)], [0, .2])
  
  const isFirstLoad = !useLocation().state
  console.log(useLocation())
  return (
    <>
      { // only run the animation if it's the first visit to the page
        // since it gets a little annoying after that
        isFirstLoad ? 
          animStyles.map((styles, index) => (
            <animated.div key = {index} 
              className={`${classes.cardcontainer} ${anims[index].className}`}
              style={{...styles, ...fadeinStyles,
                zIndex: anims[index].z}} >
              {createElement(anims[index].component)}
            </animated.div>
          )) : 
          anims.map((d,i) => <div className = {`${classes.cardcontainer} ${d.className}`}
            style= {{transform: d.transform, zIndex: d.z}} key={i}>
            {createElement(d.component)}
          </div>)
      }
      
    </>
  )
}

export default IndexPage
