import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { GetApp } from '@material-ui/icons';

import { ARTICLE_BODY, ARTICLE_LOADED, ARTICLE_MENU } from 'core/selector';
import { useElementQuery } from 'core/hooks';

import DownloadDialog from './DownloadDialog';
import { MODULE_ID } from './ModuleInfo';

const useStyles = makeStyles({
  root: {
    '& #imageToZipBtn': {
      display: 'none',
    },
  },
});

export default function ImageDownloader() {
  const { enabled } = useSelector((state) => state[MODULE_ID]);
  const [container, setContainer] = useState(null);
  const [open, setOpen] = useState(false);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);
  const classes = useStyles();

  useEffect(() => {
    if (!enabled) return null;
    if (!articleLoaded) return null;

    const menu = document.querySelector(ARTICLE_MENU);
    if (!menu) {
      if (!container) {
        setContainer(
          document
            .querySelector(ARTICLE_BODY)
            .insertAdjacentElement('afterend', document.createElement('div')),
        );
      }
      return null;
    }

    menu.classList.add(classes.root);
    if (!container) {
      const tmp = document.createElement('span');
      tmp.classList.add('float-left');
      menu.insertAdjacentElement('afterbegin', tmp);
      setContainer(tmp);
    }

    return () => {
      menu.classList.remove(classes.root);
    };
  }, [articleLoaded, classes, container, enabled]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return null;

    const confirm = (e) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', confirm);

    return () => window.removeEventListener('beforeunload', confirm);
  }, [open]);

  if (!container) return null;
  if (!enabled) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <Button
          variant="outlined"
          size="small"
          startIcon={<GetApp />}
          disabled={open}
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
