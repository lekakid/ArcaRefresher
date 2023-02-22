import { createTheme } from '@material-ui/core/styles';
import { koKR } from '@material-ui/core/locale';

const overrides = {
  MuiInputBase: {
    input: {
      backgroundColor: 'inherit !important',
    },
  },
};

const props = {
  MuiSwitch: {
    color: 'primary',
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
    props,
  },
  koKR,
);

const dark = createTheme(
  {
    palette: {
      type: 'dark',
      primary: {
        main: '#f8f9fa',
      },
      secondary: {
        main: '#242424',
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
    props,
  },
  koKR,
);

export { light, dark };
