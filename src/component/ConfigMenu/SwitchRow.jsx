import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ListItemText, Switch } from '@mui/material';

import BaseRow from './BaseRow';

const SwitchRow = forwardRef(
  ({ divider, nested, primary, secondary, value, action, onChange }, ref) => {
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
      dispatch(action());
    }, [dispatch, action]);

    return (
      <BaseRow
        ref={ref}
        divider={divider}
        nested={nested}
        header={<ListItemText primary={primary} secondary={secondary} />}
        onClick={onChange || handleClick}
      >
        <Switch checked={value} />
      </BaseRow>
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
  onChange: PropTypes.func,
};

SwitchRow.propTypes = RowPropTypes;
export default SwitchRow;
