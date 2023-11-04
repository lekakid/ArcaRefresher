import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  MenuItem,
  Box,
  ButtonGroup,
  Button,
  Tooltip,
} from '@material-ui/core';
import { Add, Delete, Label } from '@material-ui/icons';

import { GroupableSelect } from 'component';

import { SelectRow, SwitchRow } from 'component/config';
import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $setCurrent,
  $setPreset,
  $renamePreset,
} from '../slice';
import PresetNameInput from './PresetNameInput';
import RemoveConfirm from './RemoveConfirm';
import PresetEditor from './PresetEditor';

const createRow = (key, primary, secondary = '') => ({
  key,
  primary,
  secondary,
});

const groups = [
  {
    key: 'layout',
    text: '배경 및 외곽선',
    rows: [
      createRow('bg-navbar', '상단 네비게이션 바'),
      createRow('bg-body', '사이트 배경'),
      createRow('bg-main', '컨텐츠 영역 배경'),
      createRow('bg-footer', '최하단 푸터'),
      createRow('bd-navbar', '상단 네비게이션 바 경계선'),
      createRow('bd-outer', '외부 경계선'),
      createRow('bd-inner', '내부 경계선'),
      createRow('bg-focus', '게시물 포커스'),
    ],
  },
  {
    key: 'detail',
    text: '세부 요소',
    rows: [
      createRow('bg-dropdown', '드롭다운 메뉴'),
      createRow('bg-input', '입력칸'),
      createRow('text-color', '텍스트(기본)'),
      createRow('visited-article', '조회한 게시물'),
      createRow('text-muted', '비활성화'),
      createRow('link-color', '링크'),
      createRow('board-category', '글머리 배경'),
      createRow('board-category-text', '글머리 텍스트'),
      createRow('user-icon-fixed', '고정닉'),
      createRow('user-icon-public', '반고정닉'),
      createRow('bd-btn-hover', '버튼 포커스'),
      createRow('bg-highlight', '새 댓글 강조'),
      createRow('bg-highlight-user', '게시물 작성자 강조'),
      createRow('bg-link-card', '댓글 링크 카드'),
      createRow('bg-link-card-thumbnail', '댓글 링크 카드 빈 섬네일'),
      createRow('link-card-focus', '댓글 링크 카드 포커스'),
    ],
  },
  {
    key: 'wiki',
    text: '채널위키',
    rows: [
      createRow('broken-link-color', '문서가 없는 링크'),
      createRow('text-highlight', '검색 결과'),
      createRow('text-color-reverse', '텍스트(반전)'),
    ],
  },
];

const defaultPreset = {
  'bg-navbar': '#3d414d',
  'bg-body': '#eee',
  'bg-main': '#fff',
  'bg-footer': '#fff',
  'border-navbar': '#3d414d',
  'border-outer': '#bbb',
  'border-inner': '#ddd',
  'bg-focus': '#eee',
  'bg-dropdown': '#fff',
  'bg-input': '#fff',
  'text-color': '#000000',
  'visited-article': '#bbb',
  'text-muted': '#666666',
  'link-color': '#0275d8',
  'board-category': '#42464f',
  'board-category-text': '#ffffff',
  'user-icon-fixed': '#777',
  'user-icon-public': '#777',
  'btn-hover': '#007bff',
  'bg-highlight': '#fff4cc',
  'bg-highlight-user': '#efdf25cf',
  'bg-link-card': '#F9F9F9',
  'bg-link-card-thumbnail': '#EFEFEF',
  'link-card-focus': '#eee',
  'broken-link-color': 'red',
  'text-highlight': 'yellow',
  'text-color-reverse': '#d3d3d3',
};

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const {
    enabled,
    current: currentPresetKey,
    theme,
  } = useSelector((state) => state[Info.ID].storage);
  const [editingPresetKey, setEditingPresetKey] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const editingPreset = useMemo(
    () => ({
      ...defaultPreset,
      ...theme[editingPresetKey],
    }),
    [editingPresetKey, theme],
  );

  const handleTargetPreset = useCallback((e) => {
    setEditingPresetKey(e.target.value);
  }, []);

  const handleAddOpen = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const handleAddClose = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const handleAddPreset = useCallback(
    (value) => {
      dispatch($setPreset({ key: value, preset: { ...defaultPreset } }));
      setEditingPresetKey(value);
      setCreateOpen(false);
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
      dispatch($renamePreset({ prev: editingPresetKey, next: value }));
      setEditingPresetKey(value);
      setRenameOpen(false);
      if (editingPresetKey === currentPresetKey) dispatch($setCurrent(value));
    },
    [currentPresetKey, dispatch, editingPresetKey],
  );

  const handleRemoveOpen = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleRemoveClose = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleRemovePreset = useCallback(() => {
    dispatch($setPreset({ key: editingPresetKey, preset: null }));
    setConfirmOpen(false);
    setEditingPresetKey('');
    if (editingPresetKey === currentPresetKey) dispatch($setCurrent(''));
  }, [currentPresetKey, dispatch, editingPresetKey]);

  const handlePresetChange = useCallback(
    (nextPreset) => {
      dispatch($setPreset({ key: editingPresetKey, preset: nextPreset }));
    },
    [dispatch, editingPresetKey],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="알림 뮤트 MK.2 (실험적)"
            secondary="뮤트 기능을 소켓 단계에서 막는 걸로 변경합니다."
            value={enabled}
            action={$toggleEnable}
          />
          <SelectRow
            divider
            primary="전체 적용 테마"
            secondary="모든 채널에서 사용할 프리셋입니다."
            value={currentPresetKey}
            action={$setCurrent}
          >
            <MenuItem value="">없음</MenuItem>
            {Object.keys(theme).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </SelectRow>
          <ListItem>
            <ListItemText primary="프리셋 설정" />
            <ListItemSecondaryAction>
              <ButtonGroup>
                <GroupableSelect
                  variant="outlined"
                  displayEmpty
                  value={editingPresetKey}
                  onChange={handleTargetPreset}
                >
                  <MenuItem value="">프리셋 선택</MenuItem>
                  {Object.keys(theme).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </GroupableSelect>
                <Tooltip title="추가">
                  <Button onClick={handleAddOpen}>
                    <Add />
                  </Button>
                </Tooltip>
                <Tooltip title="이름 수정">
                  <Button
                    disabled={!editingPresetKey}
                    onClick={handleRenameOpen}
                  >
                    <Label />
                  </Button>
                </Tooltip>
                <Tooltip title="제거">
                  <Button
                    disabled={!editingPresetKey}
                    onClick={handleRemoveOpen}
                  >
                    <Delete />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <Box clone width="100%">
              <Paper variant="outlined">
                <PresetEditor
                  groupData={groups}
                  defaultPreset={defaultPreset}
                  preset={editingPreset}
                  disabled={!editingPresetKey}
                  onChange={handlePresetChange}
                />
              </Paper>
            </Box>
          </ListItem>
        </List>
      </Paper>
      <PresetNameInput
        open={createOpen}
        onSubmit={handleAddPreset}
        onClose={handleAddClose}
      />
      <PresetNameInput
        open={renameOpen}
        initialValue={editingPresetKey}
        onSubmit={handleRenamePreset}
        onClose={handleRenameClose}
      />
      <RemoveConfirm
        open={confirmOpen}
        target={editingPresetKey}
        onSubmit={handleRemovePreset}
        onClose={handleRemoveClose}
      />
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
