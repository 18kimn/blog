import {createTheme} from '@material-ui/core/styles'

const solarizedPalette = {
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
}

const Theme = createTheme({
  typography: {
    fontFamily: [
      'Lato',
      'Roboto',
    ].join(','),
    h1: {
      fontWeight: 400,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 300,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 400,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 300,
      fontSize: '1rem',
    },
    h5: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 300,
      fontSize: '.9rem',
    },
    body1: {
      maxWidth: '62ch',
      fontSize: '.9rem',
    },
  },
  palette: {
    solarized: solarizedPalette,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'html': {
          height: '100%',
          width: '100%',
          position: 'relative',
        },
        'body': {
          height: '100%',
          width: '100%',
          position: 'relative',
          padding: 0,
          margin: 0,
          WebkitFontSmoothing: 'auto',
          backgroundColor: solarizedPalette.base3,
          fontWeight: 400,
        },
        '#___gatsby, #gatsby-focus-wrapper': {
          height: '100%',
        },
      },
    },
    MuiGrid: {
      root: {
        height: '100%',
        width: '100%',
      },
    },
  },
})


export default Theme
