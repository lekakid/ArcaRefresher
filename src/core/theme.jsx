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
      label: {
        background: '#212121',
        text: '#fafafa',
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
    label: {
      background: '#fafafa',
      text: '#212121',
    },
  },
  overrides,
  koKR,
});

export { light, dark };
