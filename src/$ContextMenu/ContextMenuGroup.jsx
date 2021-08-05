import React from 'react';
import { Divider, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function ContextMenuGroup({ children }) {
  const classes = useStyles();
  return (
    <>
      <Divider className={classes.root} />
      {children}
    </>
  );
}
