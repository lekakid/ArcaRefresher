import React from 'react';

import ArticleMenuContainer from './ArticleMenu';
import ConfigMenuContainer from './ConfigMenu';
import ContextMenuContainer from './ContextMenu';

const articleMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/ArticleMenu$/,
);
const configMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/ConfigMenu$/,
);
const groupContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/GroupInfo$/,
);
const contextMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/ContextMenu$/,
);

const articleMenuChildren = articleMenuContext
  .keys()
  .map((path) => ({
    Component: articleMenuContext(path).default,
    key: path,
  }))
  .map(({ Component, key }) => <Component key={key} />);

const contextMenuList = contextMenuContext
  .keys()
  .map((path) => contextMenuContext(path).default)
  .sort((a, b) => a.order - b.order);

const groupList = groupContext
  .keys()
  .map((path) => groupContext(path).default)
  .sort((a, b) => a.order - b.order);

const configMenuChildren = configMenuContext
  .keys()
  .map((path) => configMenuContext(path).default);

function MenuWrapper() {
  return (
    <>
      <ArticleMenuContainer>{articleMenuChildren}</ArticleMenuContainer>
      <ContextMenuContainer menuList={contextMenuList} />
      <ConfigMenuContainer
        groupList={groupList}
        menuList={configMenuChildren}
      />
    </>
  );
}

export default MenuWrapper;
