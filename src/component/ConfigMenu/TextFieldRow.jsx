import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import DefaultRow from './DefaultRow';

const TextFieldRow = React.forwardRef(
  ({ divider, nested, primary, secondary, value, action }, ref) => {
    const dispatch = useDispatch();

    const handleChange = useCallback(
      (e) => {
        dispatch(action(e.target.value));
      },
      [dispatch, action],
    );

    return (
      <DefaultRow
        ref={ref}
        divider={divider}
        nested={nested}
        direction="column"
        primary={primary}
        secondary={secondary}
      >
        <TextField fullWidth value={value} onChange={handleChange} />
      </DefaultRow>
    );
  },
);

export default TextFieldRow;
