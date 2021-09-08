import React, { useCallback } from 'react';

import { ContextMenuBuilder } from 'menu/ContextMenu';
import { getUserID } from 'util/parser';
import { MODULE_ID } from '../ModuleInfo';
import User from './User';

export default () => {
  const trigger = useCallback((e) => !!e.target.closest('span.user-info'), []);
  const dataGetter = useCallback((e) => {
    const userInfo = e.target.closest('span.user-info');
    const id = getUserID(userInfo);

    return { id };
  }, []);

  return (
    <ContextMenuBuilder
      contextKey={MODULE_ID}
      trigger={trigger}
      dataGetter={dataGetter}
      view={<User />}
    />
  );
};
