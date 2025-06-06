import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledIndicator = styled('div')(({ pos, animate, count }) => ({
  position: 'fixed',
  border: '6px solid #d3d3d3',
  borderTop: '6px solid #3d414d',
  borderRadius: '50%',
  width: 40,
  height: 40,
  ...pos,
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

const RefreshIndicator = forwardRef(({ pos, count, animate }, ref) => (
  <StyledIndicator ref={ref} pos={pos} count={count} animate={animate} />
));

RefreshIndicator.propTypes = {
  pos: PropTypes.object,
  count: PropTypes.number,
  animate: PropTypes.bool,
};

export default RefreshIndicator;
