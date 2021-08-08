/* eslint-disable max-len */
import React, {useContext} from 'react'
import { PageLoadContext, Media } from '../components/Layout.js'
import { StaticCards, AnimCards } from '../utils/anims/HomeCards.js'

/* the control flow for the home page animations is a little lengthy and awkward, so it's been 
exported to its own file */ 

const IndexPage = () => {

  const pageLoadCount = useContext(PageLoadContext)

  return (
    <>
      <Media greaterThanOrEqual='md'>
        { pageLoadCount > 1 ? <StaticCards largeScreen={true}/> : <AnimCards largeScreen={true}/>}
      </Media>
      <Media lessThan='md'>
        { pageLoadCount > 1 ? <StaticCards largeScreen={false}/> : <AnimCards largeScreen={false}/>}
      </Media>
    </>
  )
}

export default IndexPage
