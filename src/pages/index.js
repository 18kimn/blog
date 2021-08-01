/* eslint-disable max-len */
import React from 'react'
import BasicInfo from '../components/cards/BasicInfo.js'
import About from '../components/cards/About.js'
import Portfolio from '../components/cards/Portfolio.js'
import { useSpring, useSprings, useSpringRef, useChain, animated } from '@react-spring/web'

const IndexPage = () => {

  const anims = [
    {transform: 'translate(-50%, -105%)', z: 2, component: BasicInfo, ref: useSpringRef()},
    {transform: 'translate(-105%, 5%)', z: 1, component: About, ref: useSpringRef()},
    {transform: 'translate(5%,  5%)', z: 1, component: Portfolio, ref: useSpringRef()}
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

  useChain([fadeinRef, ...anims.map(d => d.ref)], [0, 1])

  return (
    <>
      {animStyles.map((styles, index) => (
        <animated.div key = {index} 
          style={{...styles, ...fadeinStyles,
            zIndex: anims[index].z,
            top: '50%', left: '50%',position: 'fixed'}}>
          {React.createElement(anims[index].component)}
        </animated.div>
      ))}
    </>
  )
}

export default IndexPage
