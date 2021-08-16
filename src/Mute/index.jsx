import React from 'react';
import { Block } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';
import ContextMenuBuilder from '../$ContextMenu/ContextMenuBuilder';
import { getUserInfo } from '../$Common/Parser';

import {
  CONTEXT_EMOTICON_MUTE,
  CONTEXT_USER_MUTE,
  MODULE_ID,
  MODULE_NAME,
} from './ModuleInfo';
import ConfigView from './ConfigView';
import EmoticonContextMenu from './EmoticonContextMenu';
import BoardContextMenu from './BoardContextMenu';
import ArticleMuter from './ArticleMuter';
import CommentMuter from './CommentMuter';
import EmoticonMuter from './EmoticonMuter';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Block />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ContextMenuBuilder
      contextKey={CONTEXT_USER_MUTE}
      trigger={(e) => !!e.target.closest('span.user-info')}
      dataGetter={(e) => ({
        id: getUserInfo(e.target.closest('span.user-info')),
      })}
      view={<BoardContextMenu />}
    />
    <ContextMenuBuilder
      contextKey={CONTEXT_EMOTICON_MUTE}
      trigger={(e) => !!e.target.matches('.emoticon')}
      dataGetter={(e) => ({
        id: e.target.dataset.id,
        url: e.target.src.replace('https:', ''),
      })}
      view={<EmoticonContextMenu />}
    />
    <ArticleMuter />
    <CommentMuter />
    <EmoticonMuter />
  </>
);
