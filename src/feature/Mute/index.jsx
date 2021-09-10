import React from 'react';
import ConfigMenu from './ConfigMenu';
import * as ContextMenu from './ContextMenu';
import { ArticleMuter, CommentMuter, EmoticonMuter } from './feature';

function Mute() {
  return (
    <>
      <ArticleMuter />
      <CommentMuter />
      <EmoticonMuter />
    </>
  );
}

export { ConfigMenu, ContextMenu, Mute as default };
