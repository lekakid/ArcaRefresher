import React, { useCallback, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chip, Grid, makeStyles, Typography } from '@material-ui/core';

const TypeString = {
  keyword: '키워드',
  user: '사용자',
  category: '카테고리',
  deleted: '삭제됨',
  all: '전체',
};

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'right',
  },
}));

export default function CountBar({ renderContainer, classContainer, count }) {
  const [showFilter, setShowFilter] = useState(null);
  const classes = useStyles();

  useLayoutEffect(() => {
    if (showFilter || !count) return;

    setShowFilter(
      Object.fromEntries(Object.entries(count).map(([key]) => [key, false])),
    );
  }, [count, showFilter]);

  const handleClick = useCallback(
    (key) => () => {
      const suffix = key === 'all' ? '' : `-${key}`;
      const className = `show-filtered${suffix}`;
      setShowFilter((prev) => {
        classContainer.classList.toggle(className, !prev[key]);
        return {
          ...prev,
          [key]: !prev[key],
        };
      });
    },
    [classContainer],
  );

  if (!count?.all) return null;
  if (!showFilter) return null;

  return ReactDOM.createPortal(
    <Grid container alignItems="center">
      <Grid item sm={4} xs={12}>
        <Typography variant="subtitle1">필터된 게시물</Typography>
      </Grid>
      <Grid item sm={8} xs={12} className={classes.root}>
        {Object.entries(count).map(([key, value]) => {
          const suffix = key === 'all' ? '' : `-${key}`;
          const className = `show-filtered${suffix}`;
          return (
            count[key] > 0 && (
              <Chip
                key={key}
                variant={showFilter[key] ? 'outlined' : 'default'}
                size="small"
                className={className}
                data-key={key}
                onClick={handleClick(key)}
                label={`${TypeString[key]} (${value})`}
              />
            )
          );
        })}
      </Grid>
    </Grid>,
    renderContainer,
  );
}
