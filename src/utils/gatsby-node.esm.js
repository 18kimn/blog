import { generateSlug } from './stringUtils.js'
import ESLintPlugin from 'eslint-webpack-plugin'
import path from 'path'

const onCreateWebpackConfig = ({
  actions,
}) => {
  actions.setWebpackConfig({
    plugins: [
      new ESLintPlugin({
        files: 'src/**/*.js',
      }),
    ],
  })
}

const createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve('src/templates/blog-post.js')

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }

  
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.frontmatter.slug
    const formattedSlug = slug ? slug : generateSlug(node.fileAbsolutePath)

    createPage({
      path: formattedSlug,
      component: blogPostTemplate,
      context: {formattedSlug: formattedSlug, id: node.id} 
    })
  })
}


export { onCreateWebpackConfig, createPages }