import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetApp } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';
import { addContextMenu } from '../$ContextMenu/slice';
import { EventContextItemPair, IMAGE_MENU } from '../$ContextMenu/ContextEvent';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ContextMenu from './ContextMenu';
import ArticleButton from './ArticleButton';
import ConfigView from './ConfigView';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const menu = EventContextItemPair(IMAGE_MENU, <ContextMenu />);
    dispatch(addContextMenu(menu));
  }, [dispatch]);

  return (
    <>
      <ConfigBuilder
        configKey={MODULE_ID}
        buttonIcon={<GetApp />}
        buttonText={MODULE_NAME}
        view={<ConfigView />}
      />
      <ArticleButton />
    </>
  );
};
