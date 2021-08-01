import React from 'react'
import { Card, CardContent, Typography, Link } from '@material-ui/core'
import TwitterIcon from '@material-ui/icons/Twitter'
import GithubIcon from '@material-ui/icons/Github'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../../styles/CardStyles.js'
import { Row } from '../../utils/Grid.js'
import PropTypes from 'prop-types'

const BasicInfo = () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Card raised={true} className={classes.card} >
      <CardContent  className={classes.cardcontent}>
        <Typography variant='h1'>Nathan Kim</Typography>
        <Typography variant='body1'>nathan.kim@yale.edu</Typography>
        <Row justifyContent='center' style={{height: 'auto'}}>
          <TwitterIcon />
          <Link variant='body1' href="https://twitter.com/nathanckim">@nathanckim</Link>
        </Row>
        <Row justifyContent='center' style={{height: 'auto'}}>
          <GithubIcon />
          <Link variant='body1' href="https://github.com/18kimn">18kimn</Link>
        </Row>
      </CardContent>
    </Card>
  )
}

BasicInfo.propTypes = {
  style: PropTypes.object
}

export default BasicInfo
