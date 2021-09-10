import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { setAutoTime } from '../slice';

export default function ConfigMenu() {
  const dispatch = useDispatch();
  const { autoSaveTime } = useSelector((state) => state[MODULE_ID]);

  const handleSaveTime = useCallback(
    (e) => {
      dispatch(setAutoTime(e.target.value));
    },
    [dispatch],
  );

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
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
    </>
  );
}
