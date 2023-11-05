import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItem, ListItemText, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const TextFieldRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function TextFieldRow(
    { divider, nested, primary, secondary, value, action },
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
      <>
        <ListItem ref={ref} className={nested && classes.nested}>
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
        <ListItem
          ref={ref}
          divider={divider}
          className={nested && classes.nested}
        >
          <TextField fullWidth value={value} onChange={handleChange} />
        </ListItem>
      </>
    );
  },
);

export default TextFieldRow;
