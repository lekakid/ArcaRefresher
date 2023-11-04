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

import { BACKGROUND, FOREGROUND } from 'func/window';

import { SwitchRow } from 'component/config';
import Info from '../FeatureInfo';
import {
  $setOpenType,
  $setSearchGoogleMethod,
  $toggleSauceNaoBypass,
  $toggleSearchBySource,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { openType, searchBySource, searchGoogleMethod, saucenaoBypass } =
    useSelector((state) => state[Info.ID].storage);
  const dispatch = useDispatch();

  const handleOpenType = useCallback(
    (e) => {
      dispatch($setOpenType(e.target.value));
    },
    [dispatch],
  );

  const handleGoogleMethod = useCallback(
    (e) => {
      dispatch($setSearchGoogleMethod(e.target.value));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <ListItem divider>
            <ListItemText primary="검색 결과 창을 여는 방식" />
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={openType}
                onChange={handleOpenType}
              >
                <MenuItem value={FOREGROUND}>새 창으로</MenuItem>
                <MenuItem value={BACKGROUND}>백그라운드 창으로</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <SwitchRow
            divider
            primary="원본 이미지로 검색"
            secondary="검색 속도가 하락하지만 좀 더 정확한 이미지를 찾을 수도 있습니다."
            value={searchBySource}
            action={$toggleSearchBySource}
          />
          <ListItem divider>
            <ListItemText>구글 이미지 검색 방식</ListItemText>
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={searchGoogleMethod}
                onChange={handleGoogleMethod}
              >
                <ListItem value="lens">구글 렌즈</ListItem>
                <ListItem value="source">소스 검색</ListItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <SwitchRow
            primary="SauceNao 바이패스 활성화"
            secondary="정상적으로 검색되지 않을 때만 사용 바랍니다."
            value={saucenaoBypass}
            action={$toggleSauceNaoBypass}
          />
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
