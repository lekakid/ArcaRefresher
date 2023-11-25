import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ListItemText, TextField } from '@mui/material';
import BaseRow from './BaseRow';

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
      <BaseRow
        ref={ref}
        divider={divider}
        nested={nested}
        column="always"
        header={<ListItemText primary={primary} secondary={secondary} />}
      >
        <TextField fullWidth value={value} onChange={handleChange} />
      </BaseRow>
    );
  },
);

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  value: PropTypes.string,
  action: PropTypes.func,
};

TextFieldRow.propTypes = RowPropTypes;
export default TextFieldRow;
