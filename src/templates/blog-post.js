import React from 'react'
import {graphql} from 'gatsby'
import {dataPropTypes} from '../utils/propTypes'
import PageContainer from '../components/PageContainer'
import {MDXRenderer} from 'gatsby-plugin-mdx'
import {MDXProvider} from '@mdx-js/react'
import Codeblock from './../components/Codeblock'
import Box from '@material-ui/core/Box'
const shortcodes = {Codeblock}

const Template = (props) => {
  const {data} = props
  const {frontmatter, body} = data.mdx
  return (
    <PageContainer>
      <Box display="flex" flexDirection="column" style={{placeItems: 'center'}}>
        <Box maxWidth="90ch">
          <h1>{frontmatter.title}</h1>
          <h4>{frontmatter.date}</h4>
          <MDXProvider components={shortcodes}>
            <MDXRenderer>{body}</MDXRenderer>
          </MDXProvider>
        </Box>
      </Box>
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
