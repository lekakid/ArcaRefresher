import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItem, ListItemText, TextField } from '@mui/material';

const TextFieldRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function TextFieldRow(
    { divider, nested, primary, secondary, value, action },
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
      <>
        <ListItem
          ref={ref}
          sx={
            nested && {
              paddingLeft: 4,
            }
          }
        >
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
        <ListItem
          ref={ref}
          divider={divider}
          sx={
            nested && {
              paddingLeft: 4,
            }
          }
        >
          <TextField fullWidth value={value} onChange={handleChange} />
        </ListItem>
      </>
    );
  },
);

export default TextFieldRow;
