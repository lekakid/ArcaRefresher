import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  MenuItem,
  Select,
} from '@material-ui/core';

import { BACKGROUND, CURRENT, FOREGROUND } from 'func/window';

import { SwitchRow } from 'component/config';
import { $setContextRange, $setOpenType, $toggleIdVisible } from '../slice';
import Info from '../FeatureInfo';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { contextRange, openType, showId } = useSelector(
    (state) => state[Info.ID].storage,
  );

  const handleContextRange = useCallback(
    (e) => {
      dispatch($setContextRange(e.target.value));
    },
    [dispatch],
  );

  const handleOpenType = useCallback(
    (e) => {
      dispatch($setOpenType(e.target.value));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <ListItem divider>
            <ListItemText>게시판 내 우클릭 동작 범위</ListItemText>
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={contextRange}
                onChange={handleContextRange}
              >
                <MenuItem value="articleItem">게시글</MenuItem>
                <MenuItem value="nickname">닉네임</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText primary="프로필 및 검색 창을 여는 방식" />
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={openType}
                onChange={handleOpenType}
              >
                <MenuItem value={CURRENT}>열려있는 창에서</MenuItem>
                <MenuItem value={FOREGROUND}>새 창으로</MenuItem>
                <MenuItem value={BACKGROUND}>백그라운드 창으로</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <SwitchRow
            primary="반고닉 이용자 고유아이디 표시"
            secondary="로그인 상태에서 정상동작합니다"
            value={showId}
            action={$toggleIdVisible}
          />
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
