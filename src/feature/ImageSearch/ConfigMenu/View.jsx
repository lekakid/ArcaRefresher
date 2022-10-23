import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import { $toggleSauceNaoBypass, $toggleSearchBySource } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const {
    storage: { searchBySource, saucenaoBypass },
  } = useSelector((state) => state[Info.ID]);
  const dispatch = useDispatch();

  const handleSearchBySource = useCallback(() => {
    dispatch($toggleSearchBySource());
  }, [dispatch]);

  const handleSauceNaoBypass = useCallback(() => {
    dispatch($toggleSauceNaoBypass());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleSearchBySource}>
            <ListItemText
              primary="원본 이미지로 검색"
              secondary="검색 속도가 하락하지만 좀 더 정확한 이미지를 찾을 수도 있습니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={searchBySource} onClick={handleSearchBySource} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleSauceNaoBypass}>
            <ListItemText
              primary="SauceNao 바이패스 활성화"
              secondary="정상적으로 검색되지 않을 때만 사용 바랍니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={saucenaoBypass} onClick={handleSauceNaoBypass} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
