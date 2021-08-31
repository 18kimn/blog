import React from 'react'
import {graphql} from 'gatsby'
import {dataPropTypes} from '../utils/propTypes'
import PageContainer from '../components/PageContainer'
import {MDXRenderer} from 'gatsby-plugin-mdx'

const Template = (props) => {
  const {data} = props
  const {frontmatter, body} = data.mdx

  return (
    <PageContainer>
      <h1>{frontmatter.title}</h1>
      <h4>{frontmatter.date}</h4>
      <MDXRenderer>{body}</MDXRenderer>
    </PageContainer>
  )
}

Template.propTypes = dataPropTypes

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: {eq: $id}) {
      body
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`

export default Template
