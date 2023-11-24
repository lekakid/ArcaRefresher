import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Slider,
  Stack,
} from '@mui/material';

import { useOpacity } from 'menu/ConfigMenu';

const SliderRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function SliderRow(
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
  ) {
    const dispatch = useDispatch();
    const setOpacity = useOpacity();

    const handleChange = useCallback(
      (e, sliderValue) => {
        if (opacityOnChange) setOpacity(opacityOnChange);
        dispatch(action(sliderValue));
      },
      [dispatch, action, opacityOnChange, setOpacity],
    );

    return (
      <ListItem
        ref={ref}
        divider={divider}
        sx={
          nested && {
            paddingLeft: 4,
          }
        }
      >
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
          <Stack direction="row" sx={{ alignItem: 'center' }}>
            <Slider
              sx={{ minWidth: '160px' }}
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
          </Stack>
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
);

export default SliderRow;
