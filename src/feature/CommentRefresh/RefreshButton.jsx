import React from 'react';
import ReactDOM from 'react-dom';
import { IconButton } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';

export default function RefreshButton({ container, onClick }) {
  if (!container) return null;

  return ReactDOM.createPortal(
    <IconButton size="small" onClick={onClick}>
      <Refresh />
    </IconButton>,
    container,
  );
}
