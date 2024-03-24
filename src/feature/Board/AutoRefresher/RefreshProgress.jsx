import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const posValue = {
  top: {
    left: {
      top: 60,
      bottom: 'unset',
      left: 16,
      right: 'unset',
    },
    right: {
      top: 60,
      bottom: 'unset',
      left: 'unset',
      right: 16,
    },
  },
  bottom: {
    left: {
      top: 'unset',
      bottom: 20,
      left: 16,
      right: 'unset',
    },
    right: {
      top: 'unset',
      bottom: 60,
      left: 'unset',
      right: 16,
    },
  },
};

const StyledIndicator = styled('div')(({ pos, animate, count }) => ({
  position: 'fixed',
  border: '6px solid #d3d3d3',
  borderTop: '6px solid #3d414d',
  borderRadius: '50%',
  width: 40,
  height: 40,
  top: posValue[pos[0]][pos[1]].top,
  bottom: posValue[pos[0]][pos[1]].bottom,
  left: posValue[pos[0]][pos[1]].left,
  right: posValue[pos[0]][pos[1]].right,
  animationName: animate ? 'refresh-spin' : '',
  animationDuration: `${count}s`,
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  '@keyframes refresh-spin': {
    '0%': {
      transform: 'rotate(0deg)',
      boxShadow: '0 0 15px #3d414d',
    },
    '5%': {
      boxShadow: '0 0 10px #3d414d',
    },
    '15%': {
      boxShadow: '0 0 0px #3d414d',
    },
    '100%': {
      transform: 'rotate(360deg)',
      boxShadow: '0 0 0px #3d414d',
    },
  },
}));

const RefreshIndicator = forwardRef(({ pos, count, animate }, ref) => {
  const [lastPos, setLastPos] = useState(['bottom', 'left']);

  useEffect(() => {
    if (pos[0] !== 'hidden') setLastPos(pos);
  }, [pos]);

  return (
    <StyledIndicator ref={ref} pos={lastPos} count={count} animate={animate} />
  );
});

RefreshIndicator.propTypes = {
  pos: PropTypes.array,
  count: PropTypes.number,
  animate: PropTypes.bool,
};

export default RefreshIndicator;
