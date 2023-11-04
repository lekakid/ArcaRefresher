import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const SelectRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function SelectRow(
    { divider, nested, primary, secondary, children, value, action },
    ref,
  ) {
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleChange = useCallback(
      (e) => {
        dispatch(action(e.target.value));
      },
      [action, dispatch],
    );

    return (
      <ListItem
        ref={ref}
        className={nested && classes.nested}
        divider={divider}
      >
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
          <Select
            variant="outlined"
            displayEmpty
            value={value}
            onChange={handleChange}
          >
            {children}
          </Select>
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
);

export default SelectRow;
