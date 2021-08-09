import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';

import { ARTICLE_LOADED, ARTICLE_BODY } from '../$Common/Selector';
import useElementQuery from '../$Common/useElementQuery';

import DialogView from './DialogView';

export default function ArticleButton() {
  const [article, setArticle] = useState(null);
  const [open, setOpen] = useState(false);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);

  useEffect(() => {
    if (articleLoaded) setArticle(document.querySelector(ARTICLE_BODY));
  }, [articleLoaded]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  if (!article) return null;

  return ReactDOM.createPortal(
    <>
      <Button startIcon={<GetApp />} onClick={handleOpen}>
        이미지 다운로더
      </Button>
      <DialogView open={open} onClose={handleClose} />
    </>,
    article,
  );
}
