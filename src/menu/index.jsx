import React from 'react';
import {
  Create,
  Description,
  List,
  MoreHoriz,
  People,
  Web,
} from '@material-ui/icons';

import ContextMenuConfigMenu from './ContextMenu/ConfigMenu';

import ArticleMenuContainer from './ArticleMenu';
import ConfigMenuContainer from './ConfigMenu';
import ContextMenuContainer from './ContextMenu';

const articleMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/ArticleMenu$/,
);
const configMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/ConfigMenu$/,
);
const contextMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/ContextMenu$/,
);

const articleMenuChildren = articleMenuContext
  .keys()
  .map((path) => ({
    Component: articleMenuContext(path).default,
    key: path,
  }))
  .map(({ Component, key }) => <Component key={key} />);

const contextMenuChildren = contextMenuContext
  .keys()
  .map((path) => ({
    Component: contextMenuContext(path).default,
    key: path,
  }))
  .sort((a, b) => a.Component.sortOrder - b.Component.sortOrder)
  .map(({ Component, key }) => <Component key={key} />);

const configMenuChildren = configMenuContext
  .keys()
  .map((path) => configMenuContext(path).default);

function MenuWrapper() {
  return (
    <>
      <ArticleMenuContainer>{articleMenuChildren}</ArticleMenuContainer>
      <ContextMenuContainer>{contextMenuChildren}</ContextMenuContainer>
      <ConfigMenuContainer
        groupList={[
          { key: 'site', icon: <Web />, label: '사이트' },
          { key: 'user', icon: <People />, label: '이용자' },
          { key: 'board', icon: <List />, label: '게시판' },
          { key: 'article', icon: <Description />, label: '게시물' },
          { key: 'write', icon: <Create />, label: '글작성' },
          { key: 'etc', icon: <MoreHoriz />, label: '기타' },
        ]}
        menuList={[ContextMenuConfigMenu, ...configMenuChildren]}
      />
    </>
  );
}

export default MenuWrapper;
