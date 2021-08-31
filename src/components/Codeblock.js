import React from 'react'
import {Paper} from '@material-ui/core'
import PropTypes from 'prop-types'

const Codeblock = ({msg, children}) => {
  return (
    <details>
      <summary style={{cursor: 'pointer'}}>
        {msg ? msg : 'click to show code'}
      </summary>
      <Paper square={true} elevation={4}>
        {children}
      </Paper>
    </details>
  )
}

Codeblock.propTypes = {
  msg: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default Codeblock
