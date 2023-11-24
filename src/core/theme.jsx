import { createTheme } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

const components = {
  MuiButton: {
    defaultProps: {
      variant: 'outlined',
    },
  },
  MuiSelect: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSlider: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        backgroundColor: 'inherit !important',
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        marginBottom: 0,
      },
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      selectLabel: {
        marginBottom: 0,
      },
      displayedRows: {
        marginBottom: 0,
      },
    },
  },
};

const light = createTheme(
  {
    components,
    palette: {
      mode: 'light',
      primary: {
        main: '#3d414d',
      },
      secondary: {
        main: '#00a495',
      },
    },
  },
  koKR,
);

const dark = createTheme(
  {
    components,
    palette: {
      mode: 'dark',
      primary: {
        main: '#d3d3d3',
      },
      secondary: {
        main: '#00a495',
      },
    },
  },
  koKR,
);

export { light, dark };
