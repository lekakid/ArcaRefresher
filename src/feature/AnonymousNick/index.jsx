import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { addHeaderMenu } from 'menu/ArticleMenu/slice';

import ArticleHeaderButton from './ArticleHeaderButton';
import AnonymousNickList from './AnonymousNickList';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const menu = <ArticleHeaderButton />;
    dispatch(addHeaderMenu(menu));
  }, [dispatch]);

  return <AnonymousNickList />;
};
