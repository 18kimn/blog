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
    projectsCard: {
      width: 'min(70vw, 250px)',
      height: 'min(70vw, 250px)',
      margin: '30px 20px 30px 20px',
    },
    projectsCardContent: {
      position: 'relative',
      width: '250px',
      height: '25px',
      marginTop: '10px',
      marginBottom: '20px',
    },
  }),
  {index: 1},
)
