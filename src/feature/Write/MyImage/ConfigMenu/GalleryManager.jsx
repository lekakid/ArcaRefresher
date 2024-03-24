import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import {
  Add,
  Cancel,
  Delete,
  Done,
  FileCopy,
  FlipToFront,
} from '@mui/icons-material';

import { useContent } from 'hooks/Content';
import { $addFolder, $removeFolder, $setFolderData } from '../slice';

/* eslint-disable react/prop-types */
function FolderNameSelect({
  folderList,
  currentFolder,
  onSelect,
  onCreate,
  onRemove,
}) {
  return (
    <Stack sx={{ width: '100%' }} direction="row" gap={1}>
      <Select
        // 왜 인진 모르겠고 width값을 잡아주기만 하면 flexGrow를 통한 크기 조절 문제가 해결됨
        sx={{ flexGrow: 1, width: 0 }}
        value={currentFolder}
        onChange={onSelect}
      >
        {folderList.map((name) => (
          <MenuItem key={name} value={name}>
            {name === '_shared_' ? '공용 폴더' : name}
          </MenuItem>
        ))}
      </Select>
      <ButtonGroup>
        <Button startIcon={<Add />} onClick={onCreate}>
          추가
        </Button>
        <Button
          startIcon={<Delete />}
          disabled={currentFolder === '_shared_'}
          onClick={onRemove}
        >
          삭제
        </Button>
      </ButtonGroup>
    </Stack>
  );
}

const nameRegex = /^[0-9a-zA-Zㄱ-힣]*$/;
function FolderNameInput({ initialValue, validate, onDone, onCancel }) {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(validate(text));
  }, [validate, text]);

  const handleChange = (e) => {
    if (!nameRegex.test(text)) return;
    setText(e.target.value);
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') onDone(text);
    if (e.key === 'Escape') onCancel();
  };

  return (
    <Stack sx={{ width: '100%' }} direction="row" gap={1}>
      <TextField
        sx={{ flexGrow: 1, width: 0 }}
        autoFocus
        size="small"
        value={text}
        error={error}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        onKeyUp={handleKeyUp}
      />
      <ButtonGroup>
        <Button
          startIcon={<Done />}
          disabled={error}
          onClick={() => onDone(text)}
        >
          확인
        </Button>
        <Button startIcon={<Cancel />} onClick={onCancel}>
          취소
        </Button>
      </ButtonGroup>
    </Stack>
  );
}

function Toolbar({
  moving,
  disabled,
  onMove,
  onCopy,
  onCancel,
  onMoving,
  onRemove,
}) {
  if (moving) {
    return (
      <Stack direction="row" justifyContent="end">
        <Button
          startIcon={<FlipToFront />}
          disabled={disabled}
          name="move"
          onClick={onMove}
        >
          이동
        </Button>
        <Button
          startIcon={<FileCopy />}
          disabled={disabled}
          name="copy"
          onClick={onCopy}
        >
          복사
        </Button>
        <Button variant="text" startIcon={<Cancel />} onClick={onCancel}>
          취소
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" justifyContent="end">
      <Button
        variant="text"
        startIcon={<FlipToFront />}
        disabled={disabled}
        onClick={onMoving}
      >
        이동/복사
      </Button>
      <Button
        variant="text"
        startIcon={<Delete />}
        disabled={disabled}
        onClick={onRemove}
      >
        선택 삭제
      </Button>
    </Stack>
  );
}

function NoRowsOverlay() {
  return <GridOverlay>저장된 자짤이 없습니다.</GridOverlay>;
}

/* eslint-enable react/prop-types */

const columns = [
  { field: 'url', headerName: '이미지 주소', flex: 1 },
  { field: 'memo', headerName: '메모', flex: 1, editable: true },
];

function GalleryManager({ gallery }) {
  const dispatch = useDispatch();
  const { channel: channelInfo } = useContent();

  const [fromFolder, setFromFolder] = useState('_shared_');
  const [toFolder, setToFolder] = useState('_shared_');
  const [createFolder, setCreateFolder] = useState(false);
  const [moveList, setMoveList] = useState(null);
  const [selection, setSelection] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const resolveRef = useRef(null);

  const folderList = useMemo(() => Object.keys(gallery), [gallery]);
  const rows = useMemo(
    () => gallery[moveList ? toFolder : fromFolder],
    [gallery, moveList, toFolder, fromFolder],
  );

  useEffect(() => {
    setSelection([]);
  }, [fromFolder]);

  const handleSelctFolder = useCallback(
    (e) => {
      if (moveList) {
        setToFolder(e.target.value);
        return;
      }
      setFromFolder(e.target.value);
    },
    [moveList],
  );

  const handleCreateFolder = useCallback(
    (folder) => {
      dispatch($addFolder(folder));
      setFromFolder(folder);
      setCreateFolder(false);
    },
    [dispatch],
  );

  const handleRemoveFolder = useCallback(async () => {
    setConfirm(true);
    const result = await new Promise((resolve) => {
      resolveRef.current = resolve;
    });

    if (!result) {
      setConfirm(false);
      return;
    }

    setFromFolder('_shared_');
    dispatch($removeFolder(fromFolder));
    setConfirm(false);
  }, [dispatch, fromFolder]);

  const handleToggle = useCallback(() => {
    if (moveList) {
      setMoveList(null);
      return;
    }
    const list = rows.filter((row) => selection.includes(row.url));
    setMoveList(list);
  }, [rows, selection, moveList]);

  const handleMove = useCallback(() => {
    const to = gallery[toFolder];
    const from = gallery[fromFolder];
    const updatedTo = [...to, ...moveList]
      .reverse()
      .filter(
        (t, index, arr) => index === arr.findIndex((i) => i.url === t.url),
      )
      .reverse();
    const updatedFrom = from.filter(
      (f) => !moveList.some((m) => m.url === f.url),
    );

    dispatch($setFolderData({ folder: toFolder, list: updatedTo }));
    dispatch($setFolderData({ folder: fromFolder, list: updatedFrom }));
    setSelection([]);
    setFromFolder(toFolder);
    setMoveList(null);
  }, [gallery, toFolder, fromFolder, moveList, dispatch]);

  const handleCopy = useCallback(() => {
    const to = gallery[toFolder];
    const updatedTo = [...to, ...moveList]
      .reverse()
      .filter(
        (t, index, arr) => index === arr.findIndex((i) => i.url === t.url),
      )
      .reverse();

    dispatch($setFolderData({ folder: toFolder, list: updatedTo }));
    setSelection([]);
    setFromFolder(toFolder);
    setMoveList(null);
  }, [gallery, toFolder, moveList, dispatch]);

  const handleRemove = useCallback(() => {
    const from = gallery[fromFolder];
    const updatedFrom = from.filter((f) => !selection.some((s) => s === f.url));
    dispatch($setFolderData({ folder: fromFolder, list: updatedFrom }));
    setSelection([]);
  }, [gallery, fromFolder, selection, dispatch]);

  const handleCellEdit = useCallback(
    ({ id, field, value }) => {
      const updatedRows = rows.map((row) =>
        row.url === id ? { ...row, [field]: value } : row,
      );
      dispatch($setFolderData({ folder: fromFolder, list: updatedRows }));
    },
    [fromFolder, rows, dispatch],
  );

  const handleConfirmDone = useCallback(() => {
    resolveRef.current(true);
  }, []);

  const handleConfirmClose = useCallback(() => {
    resolveRef.current(false);
  }, []);

  return (
    <>
      <Stack sx={{ width: '100%' }}>
        <Paper elevation={0} sx={{ marginBottom: 1 }}>
          {createFolder ? (
            <FolderNameInput
              initialValue={channelInfo.id}
              validate={(input) => input === '' || folderList.includes(input)}
              onDone={handleCreateFolder}
              onCancel={() => setCreateFolder(false)}
            />
          ) : (
            <FolderNameSelect
              folderList={folderList}
              currentFolder={moveList ? toFolder : fromFolder}
              onSelect={handleSelctFolder}
              onCreate={() => setCreateFolder(true)}
              onRemove={handleRemoveFolder}
            />
          )}
        </Paper>
        <DataGrid
          rows={rows}
          getRowId={(row) => row.url}
          columns={columns}
          autoHeight
          rowHeight={40}
          pagination
          disableColumnMenu
          disableSelectionOnClick
          checkboxSelection={!moveList}
          components={{
            Toolbar,
            NoRowsOverlay,
          }}
          componentsProps={{
            toolbar: {
              moving: !!moveList,
              disabled: moveList
                ? fromFolder === toFolder
                : !(selection.length > 0),
              onMove: handleMove,
              onCopy: handleCopy,
              onCancel: handleToggle,
              onMoving: handleToggle,
              onRemove: handleRemove,
            },
          }}
          initialState={{
            pagination: {
              pageSize: 10,
            },
          }}
          selectionModel={selection}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onCellEditCommit={handleCellEdit}
          onSelectionModelChange={(s) => setSelection(s)}
        />
      </Stack>
      <Dialog open={confirm} onClose={handleConfirmClose}>
        <DialogTitle>폴더 삭제</DialogTitle>
        <DialogContent>{`'${fromFolder}' 폴더를 삭제합니까?`}</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDone}>예</Button>
          <Button variant="contained" onClick={handleConfirmClose}>
            아니오
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

GalleryManager.propTypes = {
  gallery: PropTypes.object,
};

export default GalleryManager;
