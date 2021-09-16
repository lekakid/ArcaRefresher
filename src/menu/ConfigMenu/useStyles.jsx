import { makeStyles } from '@material-ui/core';

const drawerWidth = 240;
const secondaryActionWidth = 160;

export default makeStyles((theme) => ({
  '@global': {
    '.body .nav-control': {
      // z-index 문제 수정
      zIndex: theme.zIndex.speedDial,
    },
  },
  root: {
    '& main > .MuiTypography-root': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    '& .MuiListItemSecondaryAction-root': {
      '& > .MuiInputBase-root': {
        minWidth: secondaryActionWidth,
      },
      '& .MuiSelect-root': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
      '& .MuiSlider-root': {
        minWidth: secondaryActionWidth,
      },
    },
    '& .MuiDataGrid-overlay': {
      backgroundColor: `${theme.palette.background.paper} !important`,
    },
  },
  bg: {
    backgroundColor: theme.palette.background.default,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  drawer: {
    width: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      zIndex: theme.zIndex.appBar - 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
  },
}));
