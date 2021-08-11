import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Comment } from '@material-ui/icons';

import { addConfig } from '../$Config/slice';
import ConfigListButton from '../$Config/ConfigListButton';
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
    dispatch(
      addConfig({
        key: MODULE_ID,
        listButton: (
          <ConfigListButton
            configKey={MODULE_ID}
            icon={<Comment />}
            text={MODULE_NAME}
          />
        ),
        content: <ConfigView />,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const menu = EventContextItemPair(USER_MENU, <ContextMenu />);
    dispatch(addContextMenu(menu));
  }, [dispatch]);

  return (
    <>
      <MemoDialog />
      <MemoList />
    </>
  );
}
