const drawerWidth = 240;
const secondaryActionWidth = 160;

export default (theme) => ({
  '@global': {
    '.body .nav-control': {
      // z-index 문제 수정
      zIndex: theme.zIndex.speedDial,
    },
  },
  root: {
    '& main > .MuiBox-root > .MuiTypography-root': {
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
    aspectRatio: '9 / 7',
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
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      zIndex: theme.zIndex.appBar - 1,
    },
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
});
