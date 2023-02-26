import React from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
    height: 24,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
}));

export default function KeyIcon({ title }) {
  const classes = useStyles();

  return <Paper className={classes.root}>{title}</Paper>;
}
