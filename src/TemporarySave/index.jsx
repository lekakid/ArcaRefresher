import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Layers } from '@material-ui/icons';

import { addConfig } from '../$Config/slice';
import ConfigListButton from '../$Config/ConfigListButton';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ButtonContainer from './ButtonContainer';
import ConfigView from './ConfigView';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addConfig({
        key: MODULE_ID,
        listButton: (
          <ConfigListButton
            configKey={MODULE_ID}
            icon={<Layers />}
            text={MODULE_NAME}
          />
        ),
        content: <ConfigView />,
      }),
    );
  }, [dispatch]);

  return <ButtonContainer />;
};