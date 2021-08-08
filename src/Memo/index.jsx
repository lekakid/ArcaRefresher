import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { EventContextItemPair, USER_MENU } from '../$ContextMenu/ContextEvent';
import { addContextMenu } from '../$ContextMenu/slice';

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
      <MemoDialog />
      <MemoList />
    </>
  );
}
