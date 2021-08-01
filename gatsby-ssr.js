import React from 'react'
import Layout from './src/components/Layout.js'

export const wrapPageElement = ({element}) => {
  return (
    <Layout content={element}></Layout>
  )
}

