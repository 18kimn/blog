import React, {useCallback, useEffect, useState} from 'react'
import {graphql} from 'gatsby'
import {useAnimation, motion} from 'framer-motion'
import {dataPropTypes} from '../../utils/propTypes'
import PageContainer from '../../components/PageContainer.js'
import {Typography} from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import TextField from '@material-ui/core/TextField'
import {debounce} from '../../utils/delay.js'
import ProjectsCard from '../../components/ProjectsCard.js'

const IndexPage = ({
  data: {
    allMdx: {edges},
  },
}) => {
  const [isGrid, setIsGrid] = useState(true)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [allPosts, setAllPosts] = useState([])
  const [posts, setPosts] = useState([])
  const [alignment, setAlignment] = useState('grid')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceInput = useCallback(
    debounce((text) => setDebouncedSearch(text), 200),
    [],
  )
  const handleChange = (event) => debounceInput(event.target.value)

  const buttonControl = {
    value: alignment,
    onChange: (_, newAlignment) => {
      setAlignment(newAlignment)
    },
    exclusive: true,
  }

  const controls = useAnimation()

  useEffect(() => {
    const allPosts = edges.filter((edge) =>
      /projects/.test(edge.node.fileAbsolutePath),
    )

    setAllPosts(allPosts)
    setPosts(allPosts)
  }, [controls, edges])

  // the search logic
  useEffect(() => {
    // filter by each word individually through an OR
    //  this allows for some flexibility or one misspelled word, et
    const searchRegex = new RegExp(
      debouncedSearch.split(' ').join('|').toLowerCase(),
    )

    setPosts((posts) => {
      if (!debouncedSearch || !posts[0]?.node?.frontmatter) return allPosts
      const newPosts = allPosts.filter(({node}) =>
        Object.values(node.frontmatter)
          .join(' ')
          .toLowerCase()
          .match(searchRegex),
      )
      return newPosts
    })
    // const filteredPosts
  }, [allPosts, debouncedSearch, isGrid])
  const animate = async (isGrid) => {
    await controls.start({
      opacity: isGrid ? 1 : 0,
      height: isGrid ? 'calc(min(70vw, 250px) - 25px)' : 0,
      // transition: {
      //   type: 'tween',
      //   ease: 'easeIn',
      //   duration: 0.2,
      // },
    })
    setIsGrid(isGrid)
  }

  return (
    <PageContainer>
      <Typography variant="h2">Projects</Typography>
      <ToggleButtonGroup
        {...buttonControl}
        style={{padding: 0, marginTop: '1rem'}}
      >
        <ToggleButton
          value="grid"
          onClick={() => animate(true)}
          style={{border: 'none'}}
        >
          Grid view
        </ToggleButton>
        <ToggleButton
          value="list"
          onClick={() => animate(false)}
          style={{border: 'none'}}
        >
          List view
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        label="search"
        variant="standard"
        onChange={handleChange}
        style={{verticalAlign: 'unset', marginLeft: '1rem', width: '30ch'}}
      />
      <motion.div
        layout="position"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: isGrid ? 'row' : 'column',
          justifyContent: isGrid ? 'center' : 'unset',
        }}
      >
        {posts.map(({node}) => (
          <ProjectsCard
            {...node}
            key={node.id}
            layoutId="post"
            {...{isGrid, controls}}
          />
        ))}
      </motion.div>
    </PageContainer>
  )
}

export const pageQuery = graphql`
  query {
    allMdx(sort: {order: DESC, fields: [frontmatter___date]}) {
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

IndexPage.propTypes = dataPropTypes

export default IndexPage
