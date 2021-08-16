import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Comment } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';
import { EventContextItemPair, USER_MENU } from '../$ContextMenu/ContextEvent';
import { addContextMenu } from '../$ContextMenu/slice';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import MemoDialog from './MemoDialog';
import MemoList from './MemoList';

export default function IPInfo() {
  const dispatch = useDispatch();

  useEffect(() => {
    const menu = EventContextItemPair(USER_MENU, <ContextMenu />);
    dispatch(addContextMenu(menu));
  }, [dispatch]);

  return (
    <>
      <ConfigBuilder
        configKey={MODULE_ID}
        buttonIcon={<Comment />}
        buttonText={MODULE_NAME}
        view={<ConfigView />}
      />
      <MemoDialog />
      <MemoList />
    </>
  );
}
