import React from 'react';
import ReactDOM from 'react-dom';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Refresh } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    color: 'var(--color-text-muted)',
  },
});

export default function RefreshButton({ container, onClick }) {
  const { root } = useStyles();

  if (!container) return null;
  return ReactDOM.createPortal(
    <IconButton classes={{ root }} size="small" onClick={onClick}>
      <Refresh />
    </IconButton>,
    container,
  );
}
