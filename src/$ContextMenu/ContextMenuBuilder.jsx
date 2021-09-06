import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { addContextMenu } from './slice';

export default function ContextMenuBuilder({
  contextKey,
  trigger,
  dataGetter,
  view,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const menu = { contextKey, trigger, dataGetter, view };
    dispatch(addContextMenu(menu));
  }, [contextKey, dataGetter, dispatch, trigger, view]);

  return null;
}
