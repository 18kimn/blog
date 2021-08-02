import React from 'react'
import Layout from './src/components/Layout.js'

export const wrapPageElement = ({element, props}) => {
  const shouldExclude = props.location && props.location.pathname.includes('files') 
  return (
    shouldExclude ? 
      element : 
      <Layout content={element}></Layout>
  )
}

