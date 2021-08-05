import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';

import useAwaitElement from '../$Common/AwaitElement';
import { ARTICLE_LOADED, ARTICLE_BODY } from '../$Common/Selector';

import DialogView from './DialogView';

export default function ArticleButton() {
  const [container, setContainer] = useState(null);
  const [open, setOpen] = useState(false);

  useAwaitElement(ARTICLE_LOADED, () => {
    setContainer(document.querySelector(ARTICLE_BODY));
  });

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  if (!container) return null;

  return ReactDOM.createPortal(
    <>
      <Button startIcon={<GetApp />} onClick={handleOpen}>
        이미지 다운로더
      </Button>
      <DialogView open={open} onClose={handleClose} />
    </>,
    container,
  );
}
