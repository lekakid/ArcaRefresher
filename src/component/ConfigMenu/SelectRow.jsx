import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ListItemText, Select } from '@mui/material';

import BaseRow from './BaseRow';

const SelectRow = forwardRef(
  ({ divider, nested, primary, secondary, children, value, action }, ref) => {
    const dispatch = useDispatch();

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
        column="lg"
        header={<ListItemText primary={primary} secondary={secondary} />}
      >
        <Select
          sx={{ minWidth: 160, width: '100%' }}
          displayEmpty
          value={value}
          onChange={handleChange}
        >
          {children}
        </Select>
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
