import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FormControl, Select, useMediaQuery } from '@mui/material';

import BaseRow from './BaseRow';

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
      <BaseRow
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
      </BaseRow>
    );
  },
);

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  action: PropTypes.func,
  children: PropTypes.node,
};

SelectRow.propTypes = RowPropTypes;
export default SelectRow;
