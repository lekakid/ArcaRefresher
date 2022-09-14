import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import { setAutoTime } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const {
    config: { autoSaveTime },
  } = useSelector((state) => state[Info.ID]);

  const handleSaveTime = useCallback(
    (e) => {
      dispatch(setAutoTime(e.target.value));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText primary="자동 저장 시간 설정" />
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={autoSaveTime}
                onChange={handleSaveTime}
              >
                <MenuItem value={0}>사용 안 함</MenuItem>
                <MenuItem value={60}>1분</MenuItem>
                <MenuItem value={180}>3분</MenuItem>
                <MenuItem value={300}>5분</MenuItem>
                <MenuItem value={600}>10분</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
