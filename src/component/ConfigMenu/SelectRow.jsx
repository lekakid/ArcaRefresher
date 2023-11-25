import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FormControl, Select, useMediaQuery } from '@mui/material';

import DefaultRow from './DefaultRow';

const SelectRow = React.forwardRef(
  ({ divider, nested, primary, secondary, children, value, action }, ref) => {
    const dispatch = useDispatch();
    const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

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
        direction={mobile ? 'column' : 'row'}
        primary={primary}
        secondary={secondary}
      >
        <FormControl sx={{ minWidth: mobile ? '100%' : '160px' }}>
          <Select displayEmpty value={value} onChange={handleChange}>
            {children}
          </Select>
        </FormControl>
      </DefaultRow>
    );
  },
);

export default SelectRow;
