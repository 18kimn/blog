import React from 'react'
import {MDXProvider} from '@mdx-js/react'
import Codeblock from './../components/Codeblock'
import {PropTypes} from 'prop-types'

const shortcodes = {Codeblock}

const Layout = ({children}) => {
  return <MDXProvider components={shortcodes}>{children}</MDXProvider>
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default Layout
