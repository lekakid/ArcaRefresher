import React, { useCallback } from 'react';
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

export default SwitchRow;
