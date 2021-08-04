import React from 'react'
import { Card, CardContent, Typography, Link, SvgIcon } from '@material-ui/core'
import { Twitter } from '@material-ui/icons'
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
          <Twitter />
          <Link variant='body1' href="https://twitter.com/nathanckim">@nathanckim</Link>
        </Row>
        <Row justifyContent='center' style={{height: 'auto'}}>
          <SvgIcon>
            <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"></path>
          </SvgIcon>
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
