import React, { useCallback, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';

export default function FormatSelector({ formatList, onSelect }) {
  const [anchor, setAnchor] = useState(null);

  const handleOpen = useCallback((e) => {
    setAnchor(e.target);
  }, []);

  const handleClose = useCallback(() => {
    setAnchor(null);
  }, []);

  const generateHandleSelect = useCallback(
    (value) => () => {
      onSelect(value);
      setAnchor(null);
    },
    [onSelect],
  );

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <Add />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleClose}>
        {formatList.map(({ value, label }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <MenuItem key={index} onClick={generateHandleSelect(value)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
