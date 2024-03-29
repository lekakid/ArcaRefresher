import ArticleMenuContainer from './ArticleMenu';
import ConfigMenuContainer from './ConfigMenu';
import ContextMenuContainer from './ContextMenu';
import SnackbarAlert from './SnackbarAlert';

const articleMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/ArticleMenu$/,
);
const articleMenuChildren = articleMenuContext
  .keys()
  .map((path) => ({
    Component: articleMenuContext(path).default,
    key: path,
  }))
  .map(({ Component, key }) => <Component key={key} />);

const contextMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/ContextMenu$/,
);
const contextMenuList = contextMenuContext
  .keys()
  .map((path) => contextMenuContext(path).default)
  .sort((a, b) => a.order - b.order);

const groupContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/GroupInfo$/,
);
const groupList = groupContext
  .keys()
  .map((path) => ({
    key: path.split('/')[1],
    ...groupContext(path).default,
  }))
  .sort((a, b) => a.order - b.order);
groupList.push(null);

const configMenuContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/ConfigMenu$/,
);
const configMenuChildren = configMenuContext.keys().map((path) => {
  const group = path.split('/')[1];
  const menuInfo = configMenuContext(path).default;

  return {
    group: group === 'NO_GROUP' ? '' : group,
    ...menuInfo,
  };
});

function MenuWrapper() {
  return (
    <>
      <ArticleMenuContainer>{articleMenuChildren}</ArticleMenuContainer>
      <ContextMenuContainer menuList={contextMenuList} />
      <ConfigMenuContainer
        groupList={groupList}
        menuList={configMenuChildren}
      />
      <SnackbarAlert />
    </>
  );
}

export default MenuWrapper;
