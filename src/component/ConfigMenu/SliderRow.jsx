import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ListItemText, Slider } from '@mui/material';

import { useOpacity } from 'menu/ConfigMenu';

import BaseRow from './BaseRow';

const SliderRow = React.forwardRef(
  (
    {
      divider,
      nested,
      primary,
      secondary,
      opacityOnChange,
      sliderProps,
      value,
      action,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const setOpacity = useOpacity();

    const handleChange = useCallback(
      (_e, sliderValue) => {
        if (opacityOnChange) setOpacity(opacityOnChange);
        dispatch(action(sliderValue));
      },
      [dispatch, action, opacityOnChange, setOpacity],
    );

    return (
      <BaseRow
        ref={ref}
        divider={divider}
        nested={nested}
        column="lg"
        header={<ListItemText primary={primary} secondary={secondary} />}
      >
        <Slider
          sx={{ minWidth: 160, width: '100%' }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...sliderProps}
          value={value}
          onChange={handleChange}
          onChangeCommitted={opacityOnChange ? () => setOpacity(1) : undefined}
        />
      </BaseRow>
    );
  },
);

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  opacityOnChange: PropTypes.number,
  sliderProps: PropTypes.object,
  value: PropTypes.number,
  action: PropTypes.func,
};

SliderRow.propTypes = RowPropTypes;
export default SliderRow;
