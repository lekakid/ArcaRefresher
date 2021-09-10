import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Switch,
  MenuItem,
  Select,
  Box,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { Add, Delete, Label } from '@material-ui/icons';
import { ColorPicker, createColor } from 'material-ui-color';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { toggleEnable, setCurrent, setPreset, renamePreset } from '../slice';
import PresetNameInput from './PresetNameInput';
import RemoveConfirm from './RemoveConfirm';

const createRow = (key, primary, secondary = '') => ({
  key,
  primary,
  secondary,
});

const rows = [
  createRow('bg-navbar', '네비게이션 색상'),
  createRow('bg-body', '배경 색상'),
  createRow('bg-main', '메인 색상'),
  createRow('bg-focus', '포커스 색상'),
  createRow('bg-dropdown', '드롭다운 색상'),
  createRow('bg-dialog', '다이얼로그 색상'),
  createRow('bg-input', '입력칸 색상'),
  createRow('bg-badge', '글머리 색상'),
  createRow('bg-footer', '푸터 색상'),
  createRow('text-color', '텍스트 색상'),
  createRow('text-muted', '뮤트 색상'),
  createRow('link-color', '링크 색상'),
  createRow('visited-article', '방문한 게시물 색상'),
  createRow('border-outer', '경계선 외곽선 색상'),
  createRow('border-inner', '경계선 내부선 색상'),
];

const defaultTheme = {
  'bg-navbar': '#3d414d',
  'bg-body': '#eee',
  'bg-main': '#fff',
  'bg-focus': '#eee',
  'bg-dropdown': '#fff',
  'bg-dialog': '#fff',
  'bg-input': '#fff',
  'bg-badge': '#3d414d',
  'bg-footer': '#fff',
  'text-color': '#373a3c',
  'text-muted': '#9ba0a4',
  'link-color': '#5b91bf',
  'visited-article': '#bbb',
  'border-outer': '#bbb',
  'border-inner': '#ddd',
};

export default function ConfigMenu() {
  const dispatch = useDispatch();
  const { enabled, current, theme } = useSelector((state) => state[MODULE_ID]);
  const [selectPreset, setSelectPreset] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const editingPreset = theme[selectPreset] || { ...defaultTheme };

  const handleEnabled = useCallback(() => {
    dispatch(toggleEnable());
  }, [dispatch]);

  const handleGlobalPreset = useCallback(
    (e) => {
      dispatch(setCurrent(e.target.value));
    },
    [dispatch],
  );

  const handleTargetPreset = useCallback((e) => {
    setSelectPreset(e.target.value);
  }, []);

  const handleAddOpen = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const handleAddClose = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const handleAddPreset = useCallback(
    (value) => {
      dispatch(setPreset({ key: value, preset: { ...defaultTheme } }));
      setCreateOpen(false);
      setSelectPreset(value);
    },
    [dispatch],
  );

  const handleRenameOpen = useCallback(() => {
    setRenameOpen(true);
  }, []);

  const handleRenameClose = useCallback(() => {
    setRenameOpen(false);
  }, []);

  const handleRenamePreset = useCallback(
    (value) => {
      dispatch(renamePreset({ prev: selectPreset, next: value }));
      setRenameOpen(false);
      setSelectPreset(value);
      if (selectPreset === current) dispatch(setCurrent(value));
    },
    [current, dispatch, selectPreset],
  );

  const handleRemoveOpen = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleRemoveClose = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleRemovePreset = useCallback(() => {
    dispatch(setPreset({ key: selectPreset, preset: null }));
    setConfirmOpen(false);
    setSelectPreset('');
    if (selectPreset === current) dispatch(setCurrent(''));
  }, [current, dispatch, selectPreset]);

  const handleColor = useCallback(
    (key) => (color) => {
      const updatePreset = {
        ...theme[selectPreset],
        [key]: color?.name !== 'none' ? color.css.backgroundColor : '',
      };
      console.log(updatePreset);
      dispatch(setPreset({ key: selectPreset, preset: updatePreset }));
    },
    [dispatch, selectPreset, theme],
  );

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleEnabled}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch checked={enabled} onChange={handleEnabled} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="전체 적용 테마"
              secondary="지정한 프리셋을 모든 채널에서 사용합니다."
            />
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                displayEmpty
                value={current}
                onChange={handleGlobalPreset}
              >
                <MenuItem value="">없음</MenuItem>
                {Object.keys(theme).map((key) => (
                  <MenuItem value={key}>{key}</MenuItem>
                ))}
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="프리셋 설정" />
            <ListItemSecondaryAction>
              <ButtonGroup>
                <Select
                  variant="outlined"
                  displayEmpty
                  value={selectPreset}
                  onChange={handleTargetPreset}
                >
                  <MenuItem value="">프리셋 선택</MenuItem>
                  {Object.keys(theme).map((key) => (
                    <MenuItem value={key}>{key}</MenuItem>
                  ))}
                </Select>
                <Tooltip title="추가">
                  <span>
                    <Button
                      disabled={selectPreset === ''}
                      onClick={handleAddOpen}
                    >
                      <Add />
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title="이름 수정">
                  <span>
                    <Button
                      disabled={selectPreset === ''}
                      onClick={handleRenameOpen}
                    >
                      <Label />
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title="제거">
                  <span>
                    <Button
                      disabled={selectPreset === ''}
                      onClick={handleRemoveOpen}
                    >
                      <Delete />
                    </Button>
                  </span>
                </Tooltip>
              </ButtonGroup>
            </ListItemSecondaryAction>
          </ListItem>
          <Box clone mx={2}>
            <Paper variant="outlined">
              <List disablePadding>
                {rows.map(({ key, primary, secondary }, index) => (
                  <ListItem
                    divider={index !== rows.length - 1}
                    disabled={!selectPreset}
                  >
                    <ListItemText primary={primary} secondary={secondary} />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        disableFocusRipple
                        disableRipple
                        disabled={!selectPreset}
                      >
                        <ColorPicker
                          hideTextfield
                          deferred
                          value={createColor(editingPreset[key])}
                          onChange={handleColor(key)}
                        />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </List>
      </Paper>
      <PresetNameInput
        open={createOpen}
        onSubmit={handleAddPreset}
        onClose={handleAddClose}
      />
      <PresetNameInput
        open={renameOpen}
        initialValue={selectPreset}
        onSubmit={handleRenamePreset}
        onClose={handleRenameClose}
      />
      <RemoveConfirm
        open={confirmOpen}
        target={selectPreset}
        onSubmit={handleRemovePreset}
        onClose={handleRemoveClose}
      />
    </>
  );
}
