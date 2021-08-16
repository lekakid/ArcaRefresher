import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import { addConfig, setSelection } from './slice';

export default function ConfigBuilder({
  configKey,
  buttonIcon = <Menu />,
  buttonText,
  view,
}) {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(setSelection(configKey));
  }, [configKey, dispatch]);

  useEffect(() => {
    dispatch(
      addConfig({
        key: configKey,
        button: (
          <ListItem button onClick={handleClick}>
            <ListItemIcon>{buttonIcon}</ListItemIcon>
            <ListItemText primary={buttonText} />
          </ListItem>
        ),
        view,
      }),
    );
  }, [buttonIcon, buttonText, configKey, dispatch, handleClick, view]);

  return null;
}
