import React, {useCallback, useState, useEffect} from 'react'
import {Paper} from '@material-ui/core'
import PropTypes from 'prop-types'
// horrendous syntax
// but can't figure out the correct way to do this re:bundle size
import {select} from 'd3-transition'
import 'd3-transition'
import useStyles from '../styles/PageStyles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const Codeblock = ({id, preopen, children}) => {
  const classes = useStyles()
  const [opened, setOpened] = useState(false)

  const toggleShow = useCallback(() => {
    const fullHeight = select(`#${id} > .gatsby-highlight > pre > code`)
      .node()
      .getBoundingClientRect().height

    setOpened((prevState) => {
      const targetHeight = prevState ? '0px' : `calc(${fullHeight}px + 2em)`
      const targetPadding = prevState ? '0em' : '1em'
      select(`#${id} > .gatsby-highlight > pre`)
        .transition()
        .duration(100)
        .style('height', targetHeight)
        .style('padding', targetPadding)
      return !prevState
    })
  }, [id])

  useEffect(() => {
    if (preopen) toggleShow()
  }, [preopen, toggleShow])

  return (
    <div className="codeBlock">
      <button
        id={'button' + id}
        onClick={toggleShow}
        className={classes.codeButton}
      >
        {opened ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        {`click to ${opened ? 'hide' : 'show'} code`}
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
  preopen: PropTypes.bool,
}

export default Codeblock
