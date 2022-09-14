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
import { toggleSauceNaoBypass } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { saucenaoBypass } = useSelector((state) => state[Info.ID]);
  const dispatch = useDispatch();

  const handleSauceNaoBypass = useCallback(() => {
    dispatch(toggleSauceNaoBypass());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
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
