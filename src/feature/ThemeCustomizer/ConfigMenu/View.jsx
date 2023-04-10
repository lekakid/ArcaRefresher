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

import { GroupableSelect } from 'component/config';

import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $setCurrent,
  $setPreset,
  $renamePreset,
} from '../slice';
import PresetNameInput from './PresetNameInput';
import RemoveConfirm from './RemoveConfirm';
import ThemeColorList from './ThemeColorList';

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
      createRow('border-navbar', '상단 네비게이션 바 경계선'),
      createRow('border-outer', '외부 경계선'),
      createRow('border-inner', '내부 경계선'),
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
      createRow('btn-hover', '버튼 포커스'),
      createRow('highlight-color', '새 댓글 강조'),
      createRow('user-highlight', '게시물 작성자 강조'),
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

const defaultTheme = {
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
  'highlight-color': '#fff4cc',
  'user-highlight': '#efdf25cf',
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
    storage: { enabled, current, theme },
  } = useSelector((state) => state[Info.ID]);
  const [selectPreset, setSelectPreset] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const presetData = {
    ...defaultTheme,
    ...theme[selectPreset],
  };

  const handleEnabled = useCallback(() => {
    dispatch($toggleEnable());
  }, [dispatch]);

  const handleGlobalPreset = useCallback(
    (e) => {
      dispatch($setCurrent(e.target.value));
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
      dispatch($setPreset({ key: value, preset: { ...defaultTheme } }));
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
      dispatch($renamePreset({ prev: selectPreset, next: value }));
      setRenameOpen(false);
      setSelectPreset(value);
      if (selectPreset === current) dispatch($setCurrent(value));
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
    dispatch($setPreset({ key: selectPreset, preset: null }));
    setConfirmOpen(false);
    setSelectPreset('');
    if (selectPreset === current) dispatch($setCurrent(''));
  }, [current, dispatch, selectPreset]);

  const handleColor = useCallback(
    (key) => (color) => {
      const updatePreset = {
        ...theme[selectPreset],
        [key]: color,
      };
      dispatch($setPreset({ key: selectPreset, preset: updatePreset }));
    },
    [dispatch, selectPreset, theme],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
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
                <GroupableSelect
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
                </GroupableSelect>
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
              <ThemeColorList
                groupData={groups}
                presetData={presetData}
                disabled={!selectPreset}
                onColorChange={handleColor}
              />
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
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
