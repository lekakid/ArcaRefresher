import ArticleMenuContainer from './ArticleMenu';
import ConfigMenuContainer from './ConfigMenu';
import ContextMenuContainer from './ContextMenu';
import SnackbarAlert from './SnackbarAlert';

const articleMenuModules = import.meta.glob(
  ['/src/feature/*/*/ArticleMenu.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const articleMenuChildren = Object.entries(articleMenuModules).map(
  ([path, Component]) => <Component key={path} />,
);

const contextMenuModules = import.meta.glob(
  ['/src/feature/*/*/ContextMenu/index.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const contextMenuList = Object.values(contextMenuModules).sort(
  (a, b) => a.order - b.order,
);

const groupModules = import.meta.glob(
  ['/src/feature/*/GroupInfo.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const groupList = Object.entries(groupModules)
  .map(([path, info]) => ({
    key: path.split('/')[3],
    ...info,
  }))
  .sort((a, b) => a.order - b.order);
groupList.push(null);

const configMenuModules = import.meta.glob(
  ['/src/feature/*/*/ConfigMenu/index.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const configMenuChildren = Object.entries(configMenuModules).map(
  ([path, info]) => {
    const group = path.split('/')[3];
    return {
      group: group === 'NO_GROUP' ? '' : group,
      ...info,
    };
  },
);

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
