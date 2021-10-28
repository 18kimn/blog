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

/*
  One thing I realized is that MUI typography specified
  here is only applied to MUI elements, not to native HTML elements
  generate from MDX or .md files

  So this needs to be put in as a global override in the MUI stylehseet ?
*/
const shared = {
  h1: {
    fontWeight: 'bold',
    fontSize: '2.5rem',
  },
  h2: {
    fontSize: '2rem',
  },
  h3: {
    fontSize: '1.5rem',
  },
  h4: {
    fontSize: '1rem',
  },
}

const Theme = createTheme({
  typography: {
    fontFamily: ['Lato', 'Roboto'].join(','),
    ...shared,
    body1: {
      maxWidth: '70ch',
      fontSize: '1rem',
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
        ':root': {
          fontSize: '14pt',
        },
        '#___gatsby, #gatsby-focus-wrapper': {
          height: '100%',
        },
        ...shared,
        'p': {
          fontSize: '1rem',
          margin: '0.5rem 0',
        },
        'li': {
          fontSize: '1rem',
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
