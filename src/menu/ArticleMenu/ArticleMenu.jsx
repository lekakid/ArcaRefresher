import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core';

import { ARTICLE_HEADER_MENU, ARTICLE_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';

const useStyles = makeStyles(() => ({
  '@global': {
    '.edit-menu:empty': {
      display: 'none',
    },
  },
  root: {
    borderTop: '1px solid var(--color-border-outer)',
    textAlign: 'end',
    '&:empty': {
      display: 'none',
    },
  },
}));

export default function ArticleMenu({ children }) {
  const [container, setContainer] = useState(null);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);

  useEffect(() => {
    if (!articleLoaded) return;

    const editMenu = document.querySelector(ARTICLE_HEADER_MENU);
    if (!editMenu) return;

    const menuContainer = document.createElement('div');
    editMenu.innerHTML = editMenu.innerHTML.trim();
    editMenu.insertAdjacentElement('afterend', menuContainer);
    setContainer(menuContainer);
  }, [articleLoaded]);

  const classes = useStyles();

  if (!container) return null;
  return ReactDOM.createPortal(
    <div className={classes.root}>{children}</div>,
    container,
  );
}
