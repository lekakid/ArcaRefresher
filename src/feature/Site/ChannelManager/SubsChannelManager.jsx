import React, { useCallback, useState } from 'react';
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
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add,
  Cancel,
  Close,
  CreateNewFolder,
  Delete,
  Done,
  FolderDelete,
  Input,
} from '@mui/icons-material';

import { useConfirm } from 'component';
import { $addGroup, $removeGroup, $setChannelInfo } from './slice';
import Info from './FeatureInfo';

const defaultChannelInfo = { memo: '', groups: [] };

function GroupRenderer({ id, value }) {
  const dispatch = useDispatch();

  const { groupList, channelInfoTable } = useSelector(
    (state) => state[Info.ID].storage,
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
    (state) => state[Info.ID].storage,
  );
  const [createGroup, setCreateGroup] = useState(false);
  const [groupInput, setGroupInput] = useState('');
  const [groupSelection, setGroupSelection] = useState('');
  const [selection, setSelection] = useState([]);
  const rows =
    subs?.map(({ id, label }) => ({
      id,
      channel: label,
      memo: channelInfoTable[id]?.memo,
      groups: channelInfoTable[id]?.groups,
    })) || [];

  const handleAddGroup = useCallback(() => {
    dispatch($addGroup({ name: groupInput }));
    setCreateGroup(false);
  }, [dispatch, groupInput]);

  const handleRemoveGroup = useCallback(async () => {
    const result = await confirm({
      title: '삭제',
      content: '정말 삭제하시겠습니까?',
    });
    if (!result) return;

    setGroupSelection('');
    dispatch($removeGroup({ name: groupSelection }));
  }, [dispatch, confirm, groupSelection]);

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

  const groupBtns = createGroup ? (
    <ButtonGroup fullWidth={mobile}>
      <Button
        startIcon={<Done />}
        disabled={!groupInput || groupList.includes(groupInput)}
        onClick={handleAddGroup}
      >
        확인
      </Button>
      <Button startIcon={<Cancel />} onClick={() => setCreateGroup(false)}>
        취소
      </Button>
    </ButtonGroup>
  ) : (
    <ButtonGroup fullWidth={mobile}>
      <Button
        startIcon={<CreateNewFolder />}
        onClick={() => {
          setCreateGroup(true);
          setGroupInput('');
        }}
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
    </ButtonGroup>
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
            {createGroup ? (
              <TextField
                sx={{ width: mobile ? '100%' : 200 }}
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
              />
            ) : (
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
            )}
            <Stack
              sx={{ width: '100%' }}
              direction={mobile ? 'column' : 'row'}
              justifyContent="space-between"
              gap={2}
            >
              {groupBtns}
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
