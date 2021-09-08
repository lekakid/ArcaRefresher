import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { ARTICLE_HEADER_MENU, ARTICLE_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';

import { MODULE_ID } from './ModuleInfo';

const useStyles = makeStyles(() => ({
  '@global': {
    '.edit-menu:empty': {
      display: 'none',
    },
  },
  root: {
    borderTop: '1px solid var(--color-border-outer)',
    textAlign: 'end',
  },
}));

export default function ArticleHeaderMenu() {
  const { menuList } = useSelector((state) => state[MODULE_ID]);
  const [container, setContainer] = useState(null);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);

  const classes = useStyles();

  useEffect(() => {
    if (articleLoaded) {
      const editMenu = document.querySelector(ARTICLE_HEADER_MENU);
      if (!editMenu) return;
      const menuContainer = document.createElement('div');
      menuContainer.classList.add(classes.root);
      editMenu.innerHTML = editMenu.innerHTML.trim();
      editMenu.insertAdjacentElement('afterend', menuContainer);
      setContainer(menuContainer);
    }
  }, [articleLoaded, classes.root]);

  if (!container) return null;
  if (menuList.length === 0) return null;

  return ReactDOM.createPortal(<div>{menuList}</div>, container);
}
