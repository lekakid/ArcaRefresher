import React, { useEffect, useReducer } from 'react';
import { Dialog, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { ARTICLE_IMAGES } from '../$Common/Selector';
import DialogImageList from './DialogImageList';
import DialogProgress from './DialogProgress';
import {
  initState,
  reducer,
  SET_DATA,
  STATUS_DOWNLOAD,
  STATUS_FINISH,
} from './DialogReducer';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function DialogView({ open, onClose }) {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    dispatch({
      type: SET_DATA,
      value: [...document.querySelectorAll(ARTICLE_IMAGES)].map((e) => {
        const url = e.src.split('?')[0];

        const orig = `${url}${e.tagName === 'VIDEO' ? '.gif' : ''}?type=orig`;
        const thumb = `${url}${e.tagName === 'VIDEO' ? '.gif' : ''}`;
        const [, ext] =
          e.tagName === 'VIDEO' ? [0, 'gif'] : url.match(/\.(.{3,4})$/);
        const [uploadName] = url.match(/[0-9a-f]{64}/g);
        const selected = false;

        return { orig, thumb, ext, uploadName, selected };
      }),
    });
  }, []);

  useEffect(() => {
    if (state.status === STATUS_FINISH) onClose();
  }, [onClose, state.status]);

  const classes = useStyles();

  return (
    <Dialog
      fullWidth
      maxWidth={state.status === STATUS_DOWNLOAD ? 'sm' : 'lg'}
      open={open && state.status !== STATUS_FINISH}
      onClose={state.status === STATUS_DOWNLOAD ? null : onClose}
    >
      <DialogTitle>
        <Typography>이미지 다운로더</Typography>
        {state.status !== STATUS_DOWNLOAD && (
          <IconButton className={classes.closeButton} onClick={onClose}>
            <Close />
          </IconButton>
        )}
      </DialogTitle>
      {state.target.length > 0 && (
        <DialogProgress state={state} dispatch={dispatch} />
      )}
      {state.target.length === 0 && (
        <DialogImageList state={state} dispatch={dispatch} />
      )}
    </Dialog>
  );
}
