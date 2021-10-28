import React, {forwardRef} from 'react'
import {navigate} from 'gatsby'
import {generateSlug} from '../utils/stringUtils.js'
import {GatsbyImage} from 'gatsby-plugin-image'
import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
} from '@material-ui/core'
import useStyles from '../styles/CardStyles.js'
import PropTypes from 'prop-types'
import {motion} from 'framer-motion'

const MotionCard = motion(Card)

// logic for each individual card on the /projects page
const ProjectsCard = forwardRef((props, ref) => {
  const classes = useStyles()
  const {fileAbsolutePath, frontmatter} = props
  const {isGrid, controls} = props
  const {title, subtitle, date} = frontmatter
  const img = frontmatter?.banner?.childImageSharp?.gatsbyImageData
  return (
    <Box
      ref={ref}
      height="100%"
      margin="1rem"
      minWidth="min(70vw, 250px)"
      width="fit-content"
      // maxWidth={isGrid ? 'min(70vw, 250px)' : '1000px'}
      // width={isGrid ? 'min(70vw, 250px)' : 'unset'}
      className={classes.projectsCard}
    >
      <MotionCard
        elevation={2}
        initial={{height: isGrid ? 'calc(min(70vw, 250px) - 25px)' : 0}}
        style={{
          width: '-moz-fit-content',
          width: 'fit-content',
          opacity: 1,
          marginBottom: '1rem',
        }}
        square={true}
        animate={controls}
      >
        <CardActionArea
          style={{maxWidth: 'min(70vw, 250px)', height: '100%'}}
          onClick={() => navigate(generateSlug(fileAbsolutePath))}
        >
          <CardContent
            style={{
              width: '100%',
              height: '100%',
              padding: '0',
            }}
          >
            {img && (
              <GatsbyImage
                width={250}
                image={img}
                style={{height: '100%'}}
                alt={`Image preview for ${title} post.`}
              />
            )}
          </CardContent>
        </CardActionArea>
      </MotionCard>
      <div className={classes.projectsCardContent}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          {!isGrid && <Typography variant="body1">{date}:&nbsp;</Typography>}
          <Typography
            onClick={() => navigate(generateSlug(fileAbsolutePath))}
            variant="body1"
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {title}
          </Typography>
        </div>
        {subtitle && (
          <Typography variant="body1" style={{opacity: 0.7}}>
            {subtitle}
          </Typography>
        )}
      </div>
    </Box>
  )
})

export default motion(ProjectsCard)
ProjectsCard.displayName = 'ProjectsCard'
ProjectsCard.propTypes = {
  isGrid: PropTypes.bool,
  fileAbsolutePath: PropTypes.string,
  frontmatter: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    date: PropTypes.string,
    banner: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        gatsbyImageData: PropTypes.object,
      }),
    }),
  }),
  controls: PropTypes.func,
}
