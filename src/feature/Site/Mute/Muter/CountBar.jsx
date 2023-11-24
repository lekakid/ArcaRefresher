import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chip, Grid, Typography } from '@mui/material';

const TypeString = {
  keyword: '키워드',
  user: '사용자',
  channel: '채널',
  category: '카테고리',
  deleted: '삭제됨',
  all: '전체',
};

function CountBar({ renderContainer, controlTarget, count, hide }) {
  const [showStates, setShowStates] = useState(undefined);
  useEffect(() => {
    setShowStates((prev) =>
      Object.fromEntries(Object.keys(count).map((key) => [key, prev?.[key]])),
    );
  }, [count]);

  const handleClick = useCallback(
    (key) => () => {
      const suffix = key === 'all' ? '' : `-${key}`;
      const className = `show-filtered${suffix}`;
      setShowStates((prev) => {
        controlTarget.classList.toggle(className, !prev[key]);
        return {
          ...prev,
          [key]: !prev[key],
        };
      });
    },
    [controlTarget],
  );

  if (count.all === 0 || (hide && count.deleted === 0)) return null;
  if (!showStates) return null;

  return ReactDOM.createPortal(
    <Grid
      container
      sx={{
        borderBottom: '1px solid var(--color-bd-outer)',
        alignItems: 'center',
      }}
    >
      <Grid item sm={4} xs={12} sx={{ paddingLeft: 1 }}>
        <Typography variant="subtitle1">뮤트(리프레셔)</Typography>
      </Grid>
      <Grid
        item
        sm={8}
        xs={12}
        sx={{
          paddingRight: 1,
          textAlign: 'end',
          '& *': {
            marginLeft: 0.5,
          },
        }}
      >
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
    channel: 0,
    category: 0,
    deleted: 0,
    all: 0,
  },
  hide: false,
};

export default CountBar;
