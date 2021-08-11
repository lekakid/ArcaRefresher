import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetApp } from '@material-ui/icons';

import { addConfig } from '../$Config/slice';
import ConfigListButton from '../$Config/ConfigListButton';
import { addContextMenu } from '../$ContextMenu/slice';
import { EventContextItemPair, IMAGE_MENU } from '../$ContextMenu/ContextEvent';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ContextMenu from './ContextMenu';
import ArticleButton from './ArticleButton';
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
            icon={<GetApp />}
            text={MODULE_NAME}
          />
        ),
        content: <ConfigView />,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const menu = EventContextItemPair(IMAGE_MENU, <ContextMenu />);
    dispatch(addContextMenu(menu));
  }, [dispatch]);

  return <ArticleButton />;
};
