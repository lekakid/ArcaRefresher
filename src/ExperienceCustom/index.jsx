import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DirectionsRun } from '@material-ui/icons';

import ConfigListButton from '../$Config/ConfigListButton';
import { addConfig } from '../$Config/slice';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ExperienceCustomizer from './ExperienceCumtomizer';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addConfig({
        key: MODULE_ID,
        listButton: (
          <ConfigListButton
            configKey={MODULE_ID}
            icon={<DirectionsRun />}
            text={MODULE_NAME}
          />
        ),
        content: <ConfigView />,
      }),
    );
  }, [dispatch]);

  return <ExperienceCustomizer />;
};
