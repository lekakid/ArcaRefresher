import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Slider, useMediaQuery } from '@mui/material';

import { useOpacity } from 'menu/ConfigMenu';

import DefaultRow from './DefaultRow';

const SliderRow = React.forwardRef(
  (
    {
      divider,
      nested,
      primary,
      secondary,
      min,
      max,
      step,
      marks,
      valueLabelFormat,
      valueLabelDisplay,
      value,
      action,
      opacityOnChange,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const setOpacity = useOpacity();
    const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    const handleChange = useCallback(
      (e, sliderValue) => {
        if (opacityOnChange) setOpacity(opacityOnChange);
        dispatch(action(sliderValue));
      },
      [dispatch, action, opacityOnChange, setOpacity],
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
        <Slider
          sx={{ width: mobile ? '100%' : '160px' }}
          min={min}
          max={max}
          step={step}
          marks={marks}
          valueLabelFormat={valueLabelFormat}
          valueLabelDisplay={valueLabelDisplay}
          value={value}
          onChange={handleChange}
          onChangeCommitted={() => setOpacity(1)}
        />
      </DefaultRow>
    );
  },
);

export default SliderRow;
