import {makeStyles} from '@material-ui/core/styles'

export default makeStyles(
  (theme) => ({
    // this is like a 'root' class that contains everything else
    'pageContainer': {
      position: 'fixed',
      zIndex: 1,
      padding: '20px', // distance from edge of screen
    },
    'page': {
      'width': '80vw',
      'height': 'calc(100% - 40px)',
      'overflowY': 'auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    'pageContent': {
      'width': '80vw',
      'height': 'calc(100% - 20px)',
      'padding': '20px 60px 20px 60px',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      'overflowY': 'auto',
      [theme.breakpoints.up('md')]: {
        overflowX: 'hidden',
      },
      'position': 'absolute', // for z-index shadows and scrollbar visibility
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    'codeButton': {
      border: 'none',
      backgroundColor: 'unset',
      cursor: 'pointer',
      display: 'flex',
      placeItems: 'center',
    },
    'codeContainer': {
      '& .gatsby-highlight': {
        '& pre': {
          padding: '0em',
          height: '0px',
          overflow: 'hidden',
        },
      },
    },
    'pre[class*="language-"]': {
      margin: 0,
    },
  }),
  {index: 1},
)
