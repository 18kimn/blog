import {makeStyles} from '@material-ui/core/styles'

/* A style specific to the Header. */
/* Global styles come from Theme.js in this folder */

export default makeStyles(
  () => ({
    NavBar: {
      padding: '15px 15px 15px',
      width: '100%',
      borderStyle: 'none none solid none',
      borderWidth: '0.1px',
    },
    NavBarItem: {
      fontSize: '1.5rem',
      color: '#000000',
      textAlign: 'center',
    },
  }),
  {index: 1},
)
