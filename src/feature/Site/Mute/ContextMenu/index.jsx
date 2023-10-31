import React from 'react';

import User from './User';
import Emoticon from './Emoticon';

function ContextMenu({ targetRef }) {
  return (
    <>
      <User targetRef={targetRef} />
      <Emoticon targetRef={targetRef} />
    </>
  );
}

ContextMenu.sortOrder = 102;

export default ContextMenu;
