import {makeStyles} from '@material-ui/core/styles'

/* A style specific to the Header. */
/* Global styles come from Theme.js in this folder */

export default makeStyles((theme) => ({
  // this is like a 'root' class that contains everything else
  pageContainer: {
    position: 'fixed',
    zIndex: 1,
    padding: '20px', //distance from edge of screen
  },
  page: {
    width: '80vw', 
    height: 'calc(100% - 40px)',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    display: 'flex', 
    alignItems: 'center'
  },
  pageContent: {
    width: '80vw', 
    height: 'calc(100% - 20px)',
    padding: '20px 60px 20px 60px',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    overflowY: 'auto',
    [theme.breakpoints.up('md')]: {
      overflowX: 'hidden',
    },
    position: 'absolute', //for z-index shadows and scrollbar visibility
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}), {index: 1})
