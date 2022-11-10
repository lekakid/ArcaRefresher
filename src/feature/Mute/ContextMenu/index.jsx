import React from 'react';

import User from './User';
import Emoticon from './Emoticon';

export default function ContextMenu({ targetRef }) {
  return (
    <>
      <User targetRef={targetRef} />
      <Emoticon targetRef={targetRef} />
    </>
  );
}
