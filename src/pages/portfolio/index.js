import React from 'react'
import { graphql, Link } from 'gatsby'
import { generateSlug } from '../../utils/stringUtils.js'
import { dataPropTypes } from '../../utils/propTypes'
import PageContainer from '../../components/PageContainer.js'
const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {

  
  const Posts = edges
    .filter(edge => /portfolio/.test(edge.node.fileAbsolutePath))
    .map(edge => {
      return <div key={edge.node.id}>
        <Link to={generateSlug(edge.node.fileAbsolutePath)}>
          {edge.node.frontmatter.title}
        </Link>
      </div>
    })


  
  return (
    <PageContainer>
      <h1>Portfolio</h1>
      <div>{Posts}</div>
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
          excerpt(pruneLength: 250)
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
          }
        }
      }
    }
  }
`

export default IndexPage
