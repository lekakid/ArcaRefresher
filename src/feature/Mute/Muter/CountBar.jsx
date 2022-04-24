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

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: '1px solid var(--color-border-outer)',
  },
  label: {
    paddingLeft: theme.spacing(1),
  },
  buttons: {
    paddingRight: theme.spacing(1),
    textAlign: 'end',
    '& *': {
      marginLeft: theme.spacing(0.5),
    },
  },
}));

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
    <Grid container alignItems="center" classes={{ root: classes.root }}>
      <Grid item sm={4} xs={12} classes={{ root: classes.label }}>
        <Typography variant="subtitle1">뮤트(리프레셔)</Typography>
      </Grid>
      <Grid item sm={8} xs={12} classes={{ root: classes.buttons }}>
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
