import React from 'react';
import ConfigView from './ConfigView';
import HeaderButton from './HeaderButton';

export default function $Config() {
  return (
    <>
      <HeaderButton dialog={ConfigView} />
    </>
  );
}
