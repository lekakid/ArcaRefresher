import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ConfigGroup from '../$Config/ConfigGroup';
import { setEnable } from './slice';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 'md',
  },
}));

export default function ConfigView() {
  const classes = useStyles();
  const { enabled } = useSelector((state) => state.contextMenuSlice);
  const dispatch = useDispatch();

  const handleTestMode = (e) => {
    dispatch(setEnable(e.target.checked));
  };

  return (
    <ConfigGroup name="컨텍스트 메뉴">
      <List className={classes.root}>
        <ListItem>
          <ListItemText>우클릭 메뉴 사용</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={enabled} onChange={handleTestMode} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </ConfigGroup>
  );
}
