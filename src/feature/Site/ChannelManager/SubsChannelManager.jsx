import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  Close,
  CreateNewFolder,
  Delete,
  DriveFileMove,
  FolderDelete,
  Input,
  Settings,
} from '@mui/icons-material';

import { useConfirm } from 'component';
import {
  $addGroup,
  $removeGroup,
  $renameGroup,
  $setChannelInfo,
} from './slice';
import Info from './FeatureInfo';

const defaultChannelInfo = { memo: '', groups: [], best: false };

function ChannelTitleRenderer({ id, value }) {
  const dispatch = useDispatch();
  const { channelInfoTable } = useSelector((state) => state[Info.id].storage);
  const [open, setOpen] = useState(false);

  const handleBestToggle = useCallback(() => {
    const channelInfo = {
      ...defaultChannelInfo,
      ...channelInfoTable[id],
      best: !channelInfoTable[id]?.best,
    };
    dispatch($setChannelInfo({ id, info: channelInfo }));
  }, [id, channelInfoTable, dispatch]);

  const handleEditBestCut = useCallback(
    (e) => {
      const regex = /^[0-9]*$/;
      if (!regex.test(e.target.value)) {
        e.preventDefault();
        return;
      }

      const channelInfo = {
        ...defaultChannelInfo,
        ...channelInfoTable[id],
        cut: parseInt(e.target.value, 10),
      };
      dispatch($setChannelInfo({ id, info: channelInfo }));
    },
    [id, channelInfoTable, dispatch],
  );

  return (
    <>
      <Stack
        sx={{ width: '100%', height: '100%' }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="body2">{value}</Typography>
        <Tooltip title="상세 편집">
          <Button
            sx={{ minWidth: 40, px: '3px' }}
            size="small"
            onClick={() => setOpen(true)}
          >
            <Settings />
          </Button>
        </Tooltip>
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{value} 설정</DialogTitle>
        <IconButton
          size="large"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          onClick={() => setOpen(false)}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <Paper variant="outlined">
            <List disablePadding>
              <ListItem
                divider
                disablePadding
                secondaryAction={
                  <Switch
                    checked={channelInfoTable[id]?.best || false}
                    onClick={handleBestToggle}
                  />
                }
              >
                <ListItemButton onClick={handleBestToggle}>
                  <ListItemText primary="개념글 페이지로" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <TextField
                  sx={{ my: 1 }}
                  label="추천 컷"
                  onChange={handleEditBestCut}
                  value={channelInfoTable[id]?.cut || 0}
                />
              </ListItem>
            </List>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
}

ChannelTitleRenderer.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
};

function GroupRenderer({ id, value }) {
  const dispatch = useDispatch();

  const { groupList, channelInfoTable } = useSelector(
    (state) => state[Info.id].storage,
  );
  const [anchorEl, setAnchorEl] = useState(false);

  const handleAdd = (group) => () => {
    const channelInfo = {
      ...defaultChannelInfo,
      ...channelInfoTable[id],
    };
    channelInfo.groups = [...channelInfo.groups, group].sort();
    dispatch($setChannelInfo({ id, info: channelInfo }));
    setAnchorEl(undefined);
  };

  const handleRemove = (group) => () => {
    const channelInfo = {
      ...defaultChannelInfo,
      ...channelInfoTable[id],
    };
    channelInfo.groups = channelInfo.groups.filter((g) => g !== group);
    dispatch($setChannelInfo({ id, info: channelInfo }));
  };

  const addibleGroups = groupList.filter((group) => !value?.includes(group));

  return (
    <Stack
      sx={{ width: '100%', height: '100%' }}
      direction="row"
      alignItems="center"
      gap={1}
    >
      {value?.map((group) => (
        <Chip key={group} label={group} onDelete={handleRemove(group)} />
      ))}
      {addibleGroups.length > 0 && (
        <>
          <IconButton size="small" onClick={(e) => setAnchorEl(e.target)}>
            <Add />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => {
              setAnchorEl(undefined);
            }}
          >
            {addibleGroups.map((group) => (
              <MenuItem key={group} onClick={handleAdd(group)}>
                {group}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
}

GroupRenderer.propTypes = {
  id: PropTypes.string,
  value: PropTypes.array,
};

function SubsChannelManager({ subs, open, onClose }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [confirm, ConfirmDialog] = useConfirm();

  const { groupList, channelInfoTable } = useSelector(
    (state) => state[Info.id].storage,
  );
  const groupInput = useRef(undefined);
  const editInputRef = useRef(null);
  const [groupSelection, setGroupSelection] = useState('');
  const [selection, setSelection] = useState([]);
  const [page, setPage] = useState(0);
  const [editingCell, setEditingCell] = useState(null);
  const pageSize = 10;

  const rows = useMemo(
    () =>
      subs?.map(({ id, label }) => ({
        id,
        channel: label,
        memo: channelInfoTable[id]?.memo,
        groups: channelInfoTable[id]?.groups,
      })) || [],
    [subs, channelInfoTable],
  );

  const pagedRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [rows, page],
  );

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);

  const handleSelectAll = useCallback(
    (e) => {
      setSelection(e.target.checked ? pagedRows.map((r) => r.id) : []);
    },
    [pagedRows],
  );

  const handleSelectRow = useCallback((id) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }, []);

  const handleCellBlur = useCallback(
    (row, field, value) => {
      setEditingCell(null);
      if (row[field] === value) return;
      const channelInfo = {
        ...defaultChannelInfo,
        ...channelInfoTable[row.id],
        [field]: value,
      };
      dispatch($setChannelInfo({ id: row.id, info: channelInfo }));
    },
    [channelInfoTable, dispatch],
  );

  const handleAddGroup = useCallback(async () => {
    const result = await confirm({
      title: '이름 입력',
      content: <TextField inputRef={groupInput} />,
      buttonList: [
        {
          label: '확인',
          value: () => groupInput.current.value,
          key: 'Enter',
          variant: 'contained',
        },
        { label: '취소', value: false, key: 'Escape' },
      ],
    });
    if (!result) return;
    dispatch($addGroup({ name: result }));
  }, [confirm, dispatch, groupInput]);

  const handleRemoveGroup = useCallback(async () => {
    const result = await confirm({
      title: '삭제',
      content: '정말 삭제하시겠습니까?',
    });
    if (!result) return;
    setGroupSelection('');
    dispatch($removeGroup({ name: groupSelection }));
  }, [dispatch, confirm, groupSelection]);

  const handleRenameGroup = useCallback(async () => {
    const result = await confirm({
      title: '이름 입력',
      content: (
        <TextField inputRef={groupInput} defaultValue={groupSelection} />
      ),
      buttonList: [
        {
          label: '확인',
          value: () => groupInput.current.value,
          key: 'Enter',
          variant: 'contained',
        },
        { label: '취소', value: false, key: 'Escape' },
      ],
    });
    if (!result) return;
    if (groupSelection === result) return;
    dispatch($renameGroup({ prev: groupSelection, next: result }));
    setGroupSelection(result);
  }, [groupSelection, groupInput, confirm, dispatch]);

  const handleAddGroupAll = useCallback(() => {
    selection.forEach((id) => {
      if (channelInfoTable[id]?.groups?.includes(groupSelection)) return;
      const channelInfo = {
        ...defaultChannelInfo,
        ...channelInfoTable[id],
      };
      channelInfo.groups = [...channelInfo.groups, groupSelection].sort();
      dispatch($setChannelInfo({ id, info: channelInfo }));
    });
    setSelection([]);
  }, [selection, channelInfoTable, groupSelection, dispatch]);

  const handleRemoveGroupAll = useCallback(() => {
    selection.forEach((id) => {
      const channelInfo = {
        ...defaultChannelInfo,
        ...channelInfoTable[id],
      };
      channelInfo.groups = [];
      dispatch($setChannelInfo({ id, info: channelInfo }));
    });
    setSelection([]);
  }, [selection, channelInfoTable, dispatch]);

  const channelBtns = (
    <ButtonGroup fullWidth={mobile}>
      <Button
        startIcon={<Input />}
        disabled={!(selection.length > 0) || !groupSelection}
        onClick={handleAddGroupAll}
      >
        그룹에 추가
      </Button>
      <Button
        startIcon={<Delete />}
        disabled={!(selection.length > 0)}
        onClick={handleRemoveGroupAll}
      >
        모든 그룹 삭제
      </Button>
    </ButtonGroup>
  );

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>구독 그룹 편집</DialogTitle>
        <IconButton
          size="large"
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <Stack
            sx={{ marginBottom: 1 }}
            direction={mobile ? 'column' : 'row'}
            gap={1}
          >
            <Select
              displayEmpty
              sx={{
                width: mobile ? '100%' : 200,
                color: groupSelection === '' ? 'grey' : undefined,
              }}
              value={groupSelection}
              onChange={(e) => setGroupSelection(e.target.value)}
            >
              <MenuItem sx={{ color: 'grey' }} value="">
                그룹 선택
              </MenuItem>
              {groupList.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
            <Stack
              sx={{ width: '100%' }}
              direction={mobile ? 'column' : 'row'}
              justifyContent="space-between"
              gap={2}
            >
              <ButtonGroup fullWidth={mobile}>
                <Button
                  startIcon={<CreateNewFolder />}
                  onClick={handleAddGroup}
                >
                  추가
                </Button>
                <Button
                  startIcon={<FolderDelete />}
                  disabled={!groupSelection}
                  onClick={handleRemoveGroup}
                >
                  제거
                </Button>
                <Button
                  startIcon={<DriveFileMove />}
                  disabled={!groupSelection}
                  onClick={handleRenameGroup}
                >
                  이름 편집
                </Button>
              </ButtonGroup>
              {channelBtns}
            </Stack>
          </Stack>
          <Paper variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selection.length > 0 &&
                        selection.length < pagedRows.length
                      }
                      checked={
                        pagedRows.length > 0 &&
                        selection.length === pagedRows.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 200, flex: 1 }}>채널</TableCell>
                  <TableCell sx={{ minWidth: 200, flex: 1 }}>메모</TableCell>
                  <TableCell sx={{ minWidth: 400, flex: 2 }}>그룹</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.length === 0 ? (
                  <TableRow sx={{ height: 200 }}>
                    <TableCell colSpan={4} align="center">
                      구독 중인 채널이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRows.map((row) => (
                    <TableRow key={row.id} sx={{ height: 40 }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selection.includes(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row.id);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <ChannelTitleRenderer row={row} value={row.channel} />
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          setEditingCell({ rowId: row.id, field: 'memo' })
                        }
                        sx={{ cursor: 'text' }}
                      >
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === 'memo' ? (
                          <input
                            ref={editInputRef}
                            defaultValue={row.memo}
                            onBlur={(e) =>
                              handleCellBlur(row, 'memo', e.target.value)
                            }
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              fontSize: 'inherit',
                            }}
                          />
                        ) : (
                          row.memo
                        )}
                      </TableCell>
                      <TableCell>
                        <GroupRenderer id={row.id} value={row.groups} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[10]}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={() => {}}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
}

SubsChannelManager.propTypes = {
  subs: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default SubsChannelManager;
