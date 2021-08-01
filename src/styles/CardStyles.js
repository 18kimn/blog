import {makeStyles} from '@material-ui/core/styles'

export default makeStyles(() => ({
  card: {
    width: '350px',
    height: '200px',
    borderRadius: '0px'
  }, 
  cardcontent: {
    height: '100%',
    width: '100%',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column',
  }
}))
