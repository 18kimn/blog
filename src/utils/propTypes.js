import PropTypes from 'prop-types'

/* I use the 'data' prop in a lot of different components,
  which is from gatsby's graphql system */
/* I'm predefining the proptypes here to get rid of an
  eslint error (and I guess to be a better coder,,...) */
const dataPropTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        date: PropTypes.string,
      }),
      edges: PropTypes.array,
      html: PropTypes.string,
    }),
    allMdx: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }).isRequired,
}

export {dataPropTypes}
