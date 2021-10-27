import {makeStyles} from '@material-ui/core/styles'

export default makeStyles(
  () => ({
    cardcontainer: {
      maxWidth: '80vw',
      width: '350px',
      height: '200px',
      borderRadius: '0px',
      top: '50%',
      left: '50%',
      position: 'fixed',
    },
    card: {
      width: '100%',
      height: '100%',
    },
    cardcontent: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    projectsCardContent: {
      position: 'relative',
    },
  }),
  {index: 1},
)
