import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from '@mui/material';

const SwitchRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function SwitchRow(
    { divider, nested, primary, secondary, value, action },
    ref,
  ) {
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
      dispatch(action());
    }, [dispatch, action]);

    return (
      <ListItem ref={ref} divider={divider} disablePadding>
        <ListItemButton
          sx={{
            paddingLeft: nested ? 4 : 2,
          }}
          onClick={handleClick}
        >
          <ListItemText primary={primary} secondary={secondary} />
          <ListItemSecondaryAction>
            <Switch checked={value} />
          </ListItemSecondaryAction>
        </ListItemButton>
      </ListItem>
    );
  },
);

export default SwitchRow;
