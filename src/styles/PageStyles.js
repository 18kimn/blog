import {makeStyles} from '@material-ui/core/styles'

/* A style specific to the Header. */
/* Global styles come from Theme.js in this folder */

export default makeStyles(() => ({
  pageContainer: {
    position: 'fixed',
    zIndex: 1,
    padding: '20px' //distance from edge of screen
  },
  page: {
    width: '80vw', 
    height: '100% - 40px',
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
    overflow: 'auto',
    position: 'absolute', //for z-index shadows and scrollbar visibility
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))
