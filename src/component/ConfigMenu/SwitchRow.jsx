import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Switch } from '@mui/material';

import DefaultRow from './DefaultRow';

const SwitchRow = React.forwardRef(
  ({ divider, nested, primary, secondary, value, action }, ref) => {
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
      dispatch(action());
    }, [dispatch, action]);

    return (
      <DefaultRow
        ref={ref}
        divider={divider}
        nested={nested}
        primary={primary}
        secondary={secondary}
        onClick={handleClick}
      >
        <Switch checked={value} />
      </DefaultRow>
    );
  },
);

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  value: PropTypes.bool,
  action: PropTypes.func,
};

SwitchRow.propTypes = RowPropTypes;
export default SwitchRow;
