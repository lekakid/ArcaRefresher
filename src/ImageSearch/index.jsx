import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { EventContextItemPair, IMAGE_MENU } from '../$ContextMenu/ContextEvent';
import { addContextMenu } from '../$ContextMenu/slice';

import ContextMenu from './ContextMenu';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const menu = EventContextItemPair(IMAGE_MENU, <ContextMenu />);
    dispatch(addContextMenu(menu));
  }, [dispatch]);

  return null;
};
