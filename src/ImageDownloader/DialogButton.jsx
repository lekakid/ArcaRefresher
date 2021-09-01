import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { GetApp } from '@material-ui/icons';

import { ARTICLE_LOADED, ARTICLE_MENU } from '../$Common/Selector';
import useElementQuery from '../$Common/useElementQuery';

import DownloadDialog from './DownloadDialog';

const useStyles = makeStyles({
  root: {
    '& #imageToZipBtn': {
      display: 'none',
    },
  },
});

export default function DialogButton() {
  const [container, setContainer] = useState(null);
  const [open, setOpen] = useState(false);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);
  const classes = useStyles();

  useEffect(() => {
    if (!articleLoaded) return;

    const menu = document.querySelector(ARTICLE_MENU);
    menu.classList.add(classes.root);
    const tmp = document.createElement('span');
    tmp.classList.add('float-left');
    menu.insertAdjacentElement('afterbegin', tmp);
    setContainer(tmp);
  }, [articleLoaded, classes]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  if (!container) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <Button
          variant="outlined"
          size="small"
          startIcon={<GetApp />}
          onClick={handleOpen}
        >
          이미지 다운로더
        </Button>,
        container,
      )}
      <DownloadDialog open={open} onClose={handleClose} />
    </>
  );
}
