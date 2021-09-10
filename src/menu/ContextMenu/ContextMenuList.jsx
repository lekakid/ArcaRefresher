import React from 'react';
import { Divider, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const ContextMenuList = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenuList({ children }, ref) {
    const classes = useStyles();
    return (
      <>
        <Divider className={classes.root} />
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { ref }),
        )}
      </>
    );
  },
);

export default ContextMenuList;
