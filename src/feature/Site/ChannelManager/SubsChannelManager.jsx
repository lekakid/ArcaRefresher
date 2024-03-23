import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add,
  Close,
  CreateNewFolder,
  Delete,
  DriveFileMove,
  FolderDelete,
  Input,
  Star,
  StarBorder,
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

  const handleBestToggle = useCallback(() => {
    const channelInfo = {
      ...defaultChannelInfo,
      ...channelInfoTable[id],
      best: !channelInfoTable[id]?.best,
    };
    dispatch($setChannelInfo({ id, info: channelInfo }));
  }, [id, channelInfoTable, dispatch]);

  return (
    <Stack
      sx={{ width: '100%' }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography>{value}</Typography>
      <Tooltip title="개념글로 바로 이동">
        <IconButton
          sx={channelInfoTable[id]?.best ? { color: 'orange' } : undefined}
          onClick={handleBestToggle}
        >
          {channelInfoTable[id]?.best ? <Star /> : <StarBorder />}
        </IconButton>
      </Tooltip>
    </Stack>
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
    <Stack sx={{ width: '100%' }} direction="row" gap={1}>
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

const columns = [
  {
    field: 'channel',
    headerName: '채널',
    flex: 1,
    minWidth: 200,
    renderCell: ChannelTitleRenderer,
  },
  {
    field: 'memo',
    headerName: '메모',
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: 'groups',
    headerName: '그룹',
    flex: 2,
    minWidth: 400,
    renderCell: GroupRenderer,
  },
];

function SubsChannelManager({ subs, open, onClose }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [confirm, ConfirmDialog] = useConfirm();

  const { groupList, channelInfoTable } = useSelector(
    (state) => state[Info.id].storage,
  );
  const groupInput = useRef(undefined);
  const [groupSelection, setGroupSelection] = useState('');
  const [selection, setSelection] = useState([]);
  const rows =
    subs?.map(({ id, label }) => ({
      id,
      channel: label,
      memo: channelInfoTable[id]?.memo,
      groups: channelInfoTable[id]?.groups,
    })) || [];

  const handleAddGroup = useCallback(async () => {
    const result = await confirm({
      title: '이름 입력',
      content: <TextField inputRef={groupInput} />,
      buttonList: [
        { label: '예', value: () => groupInput.current.value },
        { label: '아니오', value: false, variant: 'contained' },
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
        { label: '예', value: () => groupInput.current.value },
        { label: '아니오', value: false, variant: 'contained' },
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

  const handleCellEdit = useCallback(
    ({ field, id, value }) => {
      const channelInfo = {
        ...defaultChannelInfo,
        ...channelInfoTable[id],
        [field]: value,
      };
      dispatch($setChannelInfo({ id, info: channelInfo }));
    },
    [channelInfoTable, dispatch],
  );

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
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
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
          <DataGrid
            autoHeight
            disableColumnMenu
            disableSelectionOnClick
            checkboxSelection
            selectionModel={selection}
            onSelectionModelChange={(s) => setSelection(s)}
            rowsPerPageOptions={[10]}
            pageSize={10}
            columns={columns}
            rows={rows}
            onCellEditCommit={handleCellEdit}
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
