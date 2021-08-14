import React, { useEffect } from 'react'
import { Card, CardContent, CardActionArea, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../../styles/CardStyles.js'
import PropTypes from 'prop-types'
import runProjectsCardAnim from '../../utils/anims/projectsCard.js'
import expandNavigate from '../../utils/anims/expandNavigate'

const Projects = ({style}) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  useEffect(() => {
    runProjectsCardAnim()
  }, [])
  // using hard-coded className for d3 interaction
  return (
    <div className={`${classes.card} projectsCard`}>
      <Card style={{...style, position: 'absolute'}} className={classes.card} raised={true}>
        <CardActionArea style={{height: '100%'}}
          onClick={() => {
            expandNavigate('projects')
          }}>
          <CardContent className={classes.cardcontent}>
            <Typography variant='h2'>Projects</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}

Projects.propTypes = {
  style: PropTypes.object,
}

export default Projects
