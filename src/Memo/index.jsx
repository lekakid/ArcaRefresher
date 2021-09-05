import React from 'react';
import { Comment } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
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
      <ContextMenu />
      <MemoList />
    </>
  );
}
