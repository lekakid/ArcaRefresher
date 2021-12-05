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

const useStyles = makeStyles({
  root: {
    borderBottom: '1px solid var(--color-border-outer)',
  },
  right: {
    textAlign: 'right',
  },
});

function CountBar({ renderContainer, classContainer, count, hide }) {
  const [showStates, setShowStates] = useState(undefined);
  const classes = useStyles();

  useLayoutEffect(() => {
    const updated = Object.fromEntries(
      Object.keys(count).map((key) => [key, false]),
    );
    setShowStates(updated);
  }, [count]);

  const handleClick = useCallback(
    (key) => () => {
      const suffix = key === 'all' ? '' : `-${key}`;
      const className = `show-filtered${suffix}`;
      setShowStates((prev) => {
        classContainer.classList.toggle(className, !prev[key]);
        return {
          ...prev,
          [key]: !prev[key],
        };
      });
    },
    [classContainer],
  );

  if (count.all === 0 || (hide && count.deleted === 0)) return null;
  if (!showStates) return null;

  return ReactDOM.createPortal(
    <Grid container alignItems="center" className={classes.root}>
      <Grid item sm={4} xs={12}>
        <Typography variant="subtitle1">필터된 게시물</Typography>
      </Grid>
      <Grid item sm={8} xs={12} className={classes.right}>
        {Object.entries(count).map(([key, value]) => {
          if (hide && key !== 'deleted') return null;
          const suffix = key === 'all' ? '' : `-${key}`;
          const className = `show-filtered${suffix}`;
          return (
            count[key] > 0 && (
              <Chip
                key={key}
                variant={showStates[key] ? 'outlined' : 'default'}
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

CountBar.defaultProps = {
  count: {
    keyword: 0,
    user: 0,
    category: 0,
    deleted: 0,
    all: 0,
  },
  hide: false,
};

export default CountBar;
