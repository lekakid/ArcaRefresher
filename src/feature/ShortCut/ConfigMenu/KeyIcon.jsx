import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
    height: 24,
    backgroundColor: theme.palette.background.default,
  },
}));
export default function KeyIcon({ title }) {
  const classes = useStyles();

  return <Paper className={classes.root}>{title}</Paper>;
}
