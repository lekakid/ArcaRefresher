import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(
  (theme) => ({
    badge: {
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
    text: {
      '&:empty': {
        display: 'none',
      },
      '&::before': {
        content: '"["',
      },
      '&::after': {
        content: '"]"',
      },
      padding: '1px 5px',
      color: theme.palette.text.primary,
    },
  }),
  { name: 'Label' },
);

function AuthorTag({ variant, className, children }) {
  const { badge, text } = useStyles();
  const styles = clsx(className, {
    [badge]: variant === 'badge',
    [text]: variant === 'text',
  });

  return <span className={styles}>{children}</span>;
}

AuthorTag.defaultProps = {
  variant: 'badge',
};

export default React.memo(AuthorTag);
