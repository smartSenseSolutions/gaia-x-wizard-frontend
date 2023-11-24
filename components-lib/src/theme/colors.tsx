import createPalette from '@mui/material/styles/createPalette'

declare module '@mui/material/styles/createPalette' {
  interface SimplePaletteColorOptions {
    blue?: string
    darkBlue?: string
    mediumBlue?: string
    turquoise?: string
    purple?: string
    white?: string
    black?: string
    gray1?: string
    gray2?: string
    gray3?: string
    gray4?: string
    yellow?: string
    red?: string
  }

  interface PaletteColor {
    blue?: string
    darkBlue?: string
    mediumBlue?: string
    turquoise?: string
    purple?: string
    white?: string
    black?: string
    gray1?: string
    gray2?: string
    gray3?: string
    gray4?: string
    yellow?: string
    red?: string
  }
}

export const color = createPalette({
  primary: {
    main: '#000094',
    contrastText: '#fff',
    blue: '#000094',
    darkBlue: '#000071',
    mediumBlue: '#465aff',
    turquoise: '#46daff',
    purple: '#b900ff',
  },
  secondary: {
    main: '#565655',
    white: '#fff',
    black: '#000',
    gray1: '#565655',
    gray2: '#b1b2b2',
    gray3: '#d9dada',
    gray4: '#ececec',
    yellow: ' #f5d14f',
    red: '#ff3333',
  },
})
