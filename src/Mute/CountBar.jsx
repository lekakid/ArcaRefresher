import React from 'react';
import ReactDOM from 'react-dom';
import { Chip, Grid, makeStyles, Typography } from '@material-ui/core';

import { TypeString } from './filterContent';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'right',
  },
}));

export default function CountBar({ count, btnState, container, onClick }) {
  const classes = useStyles();

  if (!count?.all) return null;

  return ReactDOM.createPortal(
    <Grid container alignItems="center">
      <Grid item sm={4} xs={12}>
        <Typography variant="subtitle1">필터된 게시물</Typography>
      </Grid>
      <Grid item sm={8} xs={12} className={classes.root}>
        {Object.keys(count).map((key) => {
          const suffix = key === 'all' ? '' : `-${key}`;
          const className = `show-filtered${suffix}`;
          return (
            count[key] > 0 && (
              <Chip
                variant={btnState[key] ? 'outlined' : 'default'}
                size="small"
                className={className}
                data-key={key}
                onClick={onClick(key)}
                label={`${TypeString[key]} (${count[key]})`}
              />
            )
          );
        })}
      </Grid>
    </Grid>,
    container,
  );
}
