import React, { useEffect, useState } from 'react';
import { Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';

import { BOARD_LOADED, BOARD_VIEW_WITHOUT_ARTICLE } from '../$Common/Selector';
import useAwaitElement from '../$Common/AwaitElement';
import { getNewArticle, swapArticle } from './article';
import { EVENT_AUTOREFRESH } from '../$Common/Event';

const RUNNING_STATE = true;
const STOP_STATE = false;

export default function Refresher() {
  const { timeLimit, showProgress } = useSelector(
    (state) => state.AutoRefresher,
  );
  const [boardView, setBoardView] = useState(null);
  const [animate, setAnimation] = useState(RUNNING_STATE);

  useAwaitElement(BOARD_LOADED, () => {
    setBoardView(document.querySelector(BOARD_VIEW_WITHOUT_ARTICLE));
  });

  useEffect(() => {
    if (!boardView) return null;

    const handlePause = (event) => {
      if (event.target.tagName !== 'INPUT') return;

      if (event.target.classList.contains('batch-check-all')) {
        if (event.target.checked) setAnimation(STOP_STATE);
        else setAnimation(RUNNING_STATE);
      } else {
        const btns = [...boardView.querySelectorAll('.batch-check')];
        if (btns.some((btn) => btn.checked)) {
          setAnimation(STOP_STATE);
          return;
        }

        setAnimation(RUNNING_STATE);
      }
    };
    boardView.addEventListener('click', handlePause);

    return () => boardView.removeEventListener('click', handlePause);
  }, [boardView]);

  useEffect(() => {
    if (!boardView) return null;
    if (timeLimit === 0) return null;

    const timer = setInterval(async () => {
      if (!animate) return;

      const newArticle = await getNewArticle();
      swapArticle(boardView, newArticle);
      boardView.dispatchEvent(new Event(EVENT_AUTOREFRESH));
    }, timeLimit * 1000);

    return () => clearInterval(timer);
  }, [animate, boardView, timeLimit]);

  return (
    <Fade in={boardView && timeLimit !== 0 && showProgress}>
      <div>
        <Progress time={timeLimit} animate={animate} />
      </div>
    </Fade>
  );
}

const useStyles = makeStyles(() => ({
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
    animationDuration: (props) => props.time * 1000,
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
}));

function Progress(props) {
  const { time, animate } = props;
  const classes = useStyles(props);

  return (
    <div
      className={`${classes.root} ${time > 0 && animate && classes.animate}`}
    />
  );
}
