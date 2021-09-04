import React, { useCallback } from 'react';

import { getUserInfo } from '~/$Common/Parser';
import ContextMenuBuilder from '~/$ContextMenu/ContextMenuBuilder';

import { CONTEXT_EMOTICON_MUTE, CONTEXT_USER_MUTE } from '../ModuleInfo';
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
        contextKey={CONTEXT_USER_MUTE}
        trigger={boardtrigger}
        dataGetter={boardDataGetter}
        view={<Board />}
      />
      <ContextMenuBuilder
        contextKey={CONTEXT_EMOTICON_MUTE}
        trigger={emoticonTrigger}
        dataGetter={emoticonDataGetter}
        view={<Emoticon />}
      />
    </>
  );
};
