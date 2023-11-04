import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Slider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useOpacity } from 'menu/ConfigMenu';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

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
    const classes = useStyles();

    const handleChange = useCallback(
      (e, sliderValue) => {
        if (opacityOnChange) setOpacity(opacityOnChange);
        dispatch(action(sliderValue));
      },
      [action, dispatch, opacityOnChange, setOpacity],
    );

    return (
      <ListItem
        ref={ref}
        className={nested && classes.nested}
        divider={divider}
      >
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
          <Slider
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
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
);

export default SliderRow;
