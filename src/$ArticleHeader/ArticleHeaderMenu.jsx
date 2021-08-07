import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import useAwaitElement from '../$Common/AwaitElement';
import { ARTICLE_LOADED } from '../$Common/Selector';

const useStyles = makeStyles(() => ({
  root: {
    borderTop: '1px solid var(--color-border-outer)',
    textAlign: 'end',
  },
}));

export default function ArticleHeaderMenu() {
  const { menuList } = useSelector((state) => state.ArticleHeader);
  const [container, setContainer] = useState(null);

  const classes = useStyles();

  useAwaitElement(ARTICLE_LOADED, () => {
    const menuContainer = document.createElement('div');
    menuContainer.classList.add(classes.root);
    document
      .querySelector('.edit-menu')
      .insertAdjacentElement('afterend', menuContainer);
    setContainer(menuContainer);
  });

  if (!container) return null;
  if (menuList.length === 0) return null;

  return ReactDOM.createPortal(<div>{menuList}</div>, container);
}
