import React, {useCallback, useState} from 'react'
import {Paper} from '@material-ui/core'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import useStyles from '../styles/PageStyles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const Codeblock = ({id, children}) => {
  const classes = useStyles()
  const [opened, setOpened] = useState(false)
  const [msg, setMsg] = useState('show')

  const showCode = useCallback(() => {
    const fullHeight = d3
      .select(`#${id} > .gatsby-highlight > pre > code`)
      .node()
      .getBoundingClientRect().height

    const targetHeight = opened ? '0px' : `calc(${fullHeight}px + 2em)`
    const targetPadding = opened ? '0em' : '1em'
    const targetMsg = opened ? 'show' : 'hide'

    d3.select(`#${id} > .gatsby-highlight > pre`)
      .transition()
      .duration(100)
      .style('height', targetHeight)
      .style('padding', targetPadding)
      .on('end', () => {
        setOpened((prevState) => !prevState)
        setMsg(targetMsg)
      })
  }, [id, opened])

  return (
    <div className="codeBlock">
      <button
        id={'button' + id}
        onClick={showCode}
        className={classes.codeButton}
      >
        {opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        {`click to ${msg} code`}
      </button>
      <Paper
        square={true}
        elevation={4}
        id={id}
        className={classes.codeContainer}
      >
        {children}
      </Paper>
    </div>
  )
}

Codeblock.propTypes = {
  msg: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default Codeblock
