import { createTheme } from '@material-ui/core';
import { koKR } from '@material-ui/core/locale';

const overrides = {
  MuiInputBase: {
    input: {
      backgroundColor: 'inherit !important',
    },
  },
};

const light = createTheme(
  {
    palette: {
      type: 'light',
      primary: {
        main: '#3d414d',
      },
      secondary: {
        main: '#3d414d',
      },
    },
    overrides,
  },
  koKR,
);

const dark = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#242424',
    },
    secondary: {
      main: '#f8f9fa',
    },
    background: {
      default: '#111',
      paper: '#222',
    },
  },
  overrides,
  koKR,
});

export { light, dark };
