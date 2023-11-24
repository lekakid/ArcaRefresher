import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  FormControl,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Select,
} from '@mui/material';

const SelectRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function SelectRow(
    { divider, nested, primary, secondary, children, value, action },
    ref,
  ) {
    const dispatch = useDispatch();

    const handleChange = useCallback(
      (e) => {
        dispatch(action(e.target.value));
      },
      [dispatch, action],
    );

    return (
      <ListItem
        ref={ref}
        divider={divider}
        sx={
          nested && {
            paddingLeft: 4,
          }
        }
      >
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
          <FormControl sx={{ minWidth: '160px' }}>
            <Select displayEmpty value={value} onChange={handleChange}>
              {children}
            </Select>
          </FormControl>
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
);

export default SelectRow;
