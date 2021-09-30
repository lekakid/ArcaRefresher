import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { MODULE_ID } from './ModuleInfo';

const useStyles = makeStyles(
  {
    root: {
      position: 'fixed',
      border: '6px solid #d3d3d3',
      borderTop: '6px solid #3d414d',
      borderRadius: '50%',
      width: 40,
      height: 40,
      bottom: 30,
      left: 10,
    },
    animate: {
      animationName: '$spin',
      animationDuration: ({ count }) => count * 1000,
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
    '@keyframes spin': {
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
  },
  { name: `${MODULE_ID}(Progress)` },
);

export default function RefreshProgress({ count, animate }) {
  const classes = useStyles({ count });

  return (
    <div
      className={clsx(classes.root, {
        [classes.animate]: count > 0 && animate,
      })}
    />
  );
}
