import React from 'react'
import { Card, CardContent, CardActionArea, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../../styles/CardStyles.js'
import PropTypes from 'prop-types'
import expandNavigate from '../../utils/anims/expandNavigate'

const About = ({style}) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Card style={style} className={classes.card} raised={true}>
      <CardActionArea style={{height: '100%'}} onClick={() => expandNavigate('about')}>
        <CardContent className={classes.cardcontent}>
          <Typography variant='h2'>About Me</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

About.propTypes = {
  style: PropTypes.object
}

export default About
