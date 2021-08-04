import React, { useEffect } from 'react'
import { Card, CardContent, CardActionArea, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useStyles from '../../styles/CardStyles.js'
import PropTypes from 'prop-types'
import runPortfolioCardAnim from '../../utils/anims/portfolioCard.js'
import expandNavigate from '../../utils/anims/expandNavigate'

const Portfolio = ({style}) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  
  useEffect(() => {
    runPortfolioCardAnim()
  }, [])
  //using hard-coded className for d3 interaction
  return (
    <div className={`${classes.card} portfolioCard`}>
      <Card style={{...style, position: 'absolute'}} className={classes.card} raised={true}>
        <CardActionArea style={{height: '100%'}} 
          onClick={() => {expandNavigate('portfolio')}}>
          <CardContent className={classes.cardcontent}>
            <Typography variant='h2'>Portfolio</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}

Portfolio.propTypes = {
  style: PropTypes.object
}

export default Portfolio
