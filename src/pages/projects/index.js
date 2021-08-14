import React from 'react'
import { graphql, navigate } from 'gatsby'
import { generateSlug } from '../../utils/stringUtils.js'
import { dataPropTypes } from '../../utils/propTypes'
import PageContainer from '../../components/PageContainer.js'
import { GatsbyImage } from 'gatsby-plugin-image'
import { Card, CardContent, CardActionArea, Box,
  Grid, Typography } from '@material-ui/core'
import useStyles from '../../styles/CardStyles.js'

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges},
  },
}) => {
  const classes = useStyles()
  const Posts = edges
    .filter((edge) => /projects/.test(edge.node.fileAbsolutePath))
    .map((edge) => {
      const node = edge.node
      const frontmatter = node.frontmatter
      const img = frontmatter?.banner?.childImageSharp?.gatsbyImageData

      return <Grid item className={classes.projectsCard} key={node.id}>
        <Box width='100%' height='100%' marginBottom='40px'>
          <Card elevation={2} style={{width: '100%', height: 'calc(min(70vw, 250px) - 25px)'}}>
            <CardActionArea style={{width: '100%', height: '100%'}}
              onClick={() => navigate(generateSlug(node.fileAbsolutePath))}>
              <CardContent style={{width: '100%', height: '100%', padding: '0'}}>
                { img &&
                <GatsbyImage image={img} style={{height: '100%'}}
                  alt={`Image preview for ${frontmatter.title} post.`} />
                }
              </CardContent>
            </CardActionArea>
          </Card>
          <div className={classes.projectsCardContent}>
            <Typography variant='h5'>{frontmatter.title}</Typography>
            { frontmatter.subtitle &&
                <Typography variant='h6'>{frontmatter.subtitle}</Typography>
            }
          </div>
        </Box>
      </Grid>
    })

  return (
    <PageContainer>
      <Typography variant='h1'>Projects</Typography>
      <Grid container justifyContent='center'>
        {Posts}
      </Grid>
    </PageContainer>
  )
}

IndexPage.propTypes = dataPropTypes

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          fileAbsolutePath
          frontmatter {
            title
            subtitle
            banner {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
              }
            }
            date(formatString: "YYYY-MM-DD")
          }
        }
      }
    }
  }
`

export default IndexPage
