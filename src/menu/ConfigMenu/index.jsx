import React from 'react';
import ConfigMenu from './ConfigMenu';
import HeaderButton from './HeaderButton';

export { default as ConfigListButton } from './ConfigListButton';

export default (props) => (
  <>
    {React.cloneElement(<ConfigMenu />, props)}
    <HeaderButton />
  </>
);
