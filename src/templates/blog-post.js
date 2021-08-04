import React from 'react'
import { graphql } from 'gatsby'
import { dataPropTypes } from '../utils/propTypes'
import PageContainer from '../components/PageContainer'

const Template = (props) => {
  const { data} = props
  const {frontmatter, html} = data.markdownRemark
  
  return (
    <PageContainer>
      <h1>{frontmatter.title}</h1>
      <h4>{frontmatter.date}</h4>
      <div dangerouslySetInnerHTML={{__html: html}}/>
    </PageContainer>
  )
}

Template.propTypes = dataPropTypes

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: {eq: $id}) {
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`

export default Template