import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Menu } from '@material-ui/icons';

import ConfigListButton from '../$Config/ConfigListButton';
import { addConfig } from '../$Config/slice';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import ContextSnack from './ContextSnack';

export default function $ContextMenu() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addConfig({
        key: MODULE_ID,
        listButton: (
          <ConfigListButton
            configKey={MODULE_ID}
            icon={<Menu />}
            text={MODULE_NAME}
          />
        ),
        content: <ConfigView />,
      }),
    );
  }, [dispatch]);

  return (
    <>
      <ContextMenu />
      <ContextSnack />
    </>
  );
}
