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
  Tooltip,
} from '@material-ui/core';
import { Add, Delete, Label } from '@material-ui/icons';
import { ColorPicker, createColor } from 'material-ui-color';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { toggleEnable, setCurrent, setPreset, renamePreset } from '../slice';
import PresetNameInput from './PresetNameInput';
import RemoveConfirm from './RemoveConfirm';
import EditPresetSelector from './EditPresetSelector';

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
  createRow('bg-table', '테이블 색상'),
  createRow('text-color', '텍스트 색상'),
  createRow('text-color-reverse', '반전 텍스트 색상'),
  createRow('text-muted', '뮤트 색상'),
  createRow('text-highlight', '댓글 강조 색상'),
  createRow('link-color', '링크 색상'),
  createRow('visited-article', '방문한 게시물 색상'),
  createRow('border-outer', '경계선 외곽선 색상'),
  createRow('border-inner', '경계선 내부선 색상'),
  createRow('btn-hover', '버튼 오버 색상'),
  createRow('highlight-color', '댓글 강조 색상'),
  createRow('user-highlight', '작성자 강조 색상'),
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
  'bg-table': '#f5f5f5',
  'text-color': '#373a3c',
  'text-color-reverse': '#d3d3d3',
  'text-muted': '#9ba0a4',
  'text-highlight': 'yellow',
  'link-color': '#5b91bf',
  'visited-article': '#bbb',
  'border-outer': '#bbb',
  'border-inner': '#ddd',
  'btn-hover': '#007bff',
  'highlight-color': '#fff4cc',
  'user-highlight': '#efdf25cf',
};

const ConfigMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ConfigMenu(_props, ref) {
    const dispatch = useDispatch();
    const { enabled, current, theme } = useSelector(
      (state) => state[MODULE_ID],
    );
    const [selectPreset, setSelectPreset] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const editingPreset = {
      ...defaultTheme,
      ...theme[selectPreset],
    };

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
        dispatch(setPreset({ key: selectPreset, preset: updatePreset }));
      },
      [dispatch, selectPreset, theme],
    );

    return (
      <Box ref={ref}>
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
                secondary="모든 채널에서 사용할 프리셋입니다."
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
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="프리셋 설정" />
              <ListItemSecondaryAction>
                <ButtonGroup>
                  <EditPresetSelector
                    variant="outlined"
                    displayEmpty
                    value={selectPreset}
                    onChange={handleTargetPreset}
                  >
                    <MenuItem value="">프리셋 선택</MenuItem>
                    {Object.keys(theme).map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </EditPresetSelector>
                  <Tooltip title="추가">
                    <Button onClick={handleAddOpen}>
                      <Add />
                    </Button>
                  </Tooltip>
                  <Tooltip title="이름 수정">
                    <Button
                      disabled={selectPreset === ''}
                      onClick={handleRenameOpen}
                    >
                      <Label />
                    </Button>
                  </Tooltip>
                  <Tooltip title="제거">
                    <Button
                      disabled={selectPreset === ''}
                      onClick={handleRemoveOpen}
                    >
                      <Delete />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </ListItemSecondaryAction>
            </ListItem>
            <Box clone mx={2}>
              <Paper variant="outlined">
                <List disablePadding>
                  {rows.map(({ key, primary, secondary }, index) => (
                    <ListItem
                      key={key}
                      divider={index !== rows.length - 1}
                      disabled={!selectPreset}
                    >
                      <ListItemText primary={primary} secondary={secondary} />
                      <ListItemSecondaryAction>
                        <span>
                          <ColorPicker
                            hideTextfield
                            deferred
                            value={createColor(editingPreset[key])}
                            onChange={handleColor(key)}
                          />
                        </span>
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
      </Box>
    );
  },
);

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
