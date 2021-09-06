import { makeStyles } from '@material-ui/core';

const drawerWidth = 240;
const secondaryActionWidth = 160;

export default makeStyles((theme) => ({
  '@global': {
    '.body .nav-control': {
      zIndex: 1050,
    },
  },
  root: {
    '& main > .MuiTypography-root': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    '& .MuiListItemSecondaryAction-root > .MuiInputBase-root': {
      minWidth: secondaryActionWidth,
    },
    '& .MuiListItemSecondaryAction-root .MuiSelect-root': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    '& .MuiListItemSecondaryAction-root .MuiSlider-root': {
      minWidth: secondaryActionWidth,
    },
  },
  bg: {
    backgroundColor: theme.palette.grey[100],
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
  },
}));
