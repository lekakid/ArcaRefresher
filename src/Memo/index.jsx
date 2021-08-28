import React from 'react';
import { Comment } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';
import ContextMenuBuilder from '../$ContextMenu/ContextMenuBuilder';
import { getUserID } from '../$Common/Parser';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import ContextDialog from './ContextDialog';
import MemoList from './MemoList';

export default function IPInfo() {
  return (
    <>
      <ConfigBuilder
        configKey={MODULE_ID}
        buttonIcon={<Comment />}
        buttonText={MODULE_NAME}
        view={<ConfigView />}
      />
      <ContextMenuBuilder
        contextKey={MODULE_ID}
        trigger={(e) => !!e.target.closest('span.user-info')}
        dataGetter={(e) => {
          const userInfo = e.target.closest('span.user-info');
          const id = getUserID(userInfo);

          return { id };
        }}
        view={<ContextMenu />}
      />
      <ContextDialog />
      <MemoList />
    </>
  );
}
