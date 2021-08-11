import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Delete } from '@material-ui/icons';

import ConfigListButton from '../$Config/ConfigListButton';
import { addConfig } from '../$Config/slice';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import Remover from './Remover';

export default function AutoRefresher() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addConfig({
        key: MODULE_ID,
        listButton: (
          <ConfigListButton
            configKey={MODULE_ID}
            icon={<Delete />}
            text={MODULE_NAME}
          />
        ),
        content: <ConfigView />,
      }),
    );
  }, [dispatch]);

  return <Remover />;
}
