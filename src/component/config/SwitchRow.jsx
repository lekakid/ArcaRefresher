import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const SwitchRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function SwitchRow(
    { divider, nested, primary, secondary, value, action },
    ref,
  ) {
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleClick = useCallback(() => {
      dispatch(action());
    }, [action, dispatch]);

    return (
      <ListItem
        ref={ref}
        className={nested && classes.nested}
        divider={divider}
        button
        onClick={handleClick}
      >
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
          <Switch checked={value} onClick={handleClick} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
);

export default SwitchRow;
