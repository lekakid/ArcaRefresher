import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      '&:empty': {
        display: 'none',
      },
      marginLeft: '4px',
      padding: '1px 5px',
      borderRadius: '1em',
      backgroundColor: theme.palette.label.background,
      color: theme.palette.label.text,
      fontSize: '0.85em',
    },
  }),
  { name: 'Label' },
);

function Label({ className, children }) {
  const { root } = useStyles();
  const styles = clsx(root, className);

  return <span className={styles}>{children}</span>;
}

export default React.memo(Label);
