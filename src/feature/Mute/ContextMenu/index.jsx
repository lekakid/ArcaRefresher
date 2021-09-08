import React, { useCallback } from 'react';

import { getUserInfo } from 'util/parser';
import ContextMenuBuilder from 'menu/ContextMenu/ContextMenuBuilder';

import { EMOTICON_MUTE, USER_MUTE } from './id';
import Board from './Board';
import Emoticon from './Emoticon';

export default () => {
  const boardtrigger = useCallback(
    (e) => !!e.target.closest('span.user-info'),
    [],
  );
  const boardDataGetter = useCallback(
    (e) => ({
      id: getUserInfo(e.target.closest('span.user-info')),
    }),
    [],
  );

  const emoticonTrigger = useCallback(
    (e) => !!e.target.matches('.emoticon'),
    [],
  );
  const emoticonDataGetter = useCallback(
    (e) => ({
      id: e.target.dataset.id,
      url: e.target.src.replace('https:', ''),
    }),
    [],
  );

  return (
    <>
      <ContextMenuBuilder
        contextKey={USER_MUTE}
        trigger={boardtrigger}
        dataGetter={boardDataGetter}
        view={<Board />}
      />
      <ContextMenuBuilder
        contextKey={EMOTICON_MUTE}
        trigger={emoticonTrigger}
        dataGetter={emoticonDataGetter}
        view={<Emoticon />}
      />
    </>
  );
};
