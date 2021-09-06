import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { Remove, Subject, TableChart } from '@material-ui/icons';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import { setMemoList } from './slice';

const columns = [
  { field: 'id', headerName: '이용자', flex: 1 },
  { field: 'memo', headerName: '메모', flex: 1, editable: true },
];

function ConfigToolbar({ disabled, onRemove }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <Button startIcon={<Remove />} disabled={disabled} onClick={onRemove}>
        삭제
      </Button>
    </div>
  );
}

export default function ConfigView() {
  const dispatch = useDispatch();
  const { memo } = useSelector((state) => state[MODULE_ID]);
  const tableRows = Object.keys(memo).map((key) => ({
    id: key,
    memo: memo[key],
  }));
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [textMode, setTextMode] = useState(false);
  const [textError, setTextError] = useState(false);
  const [memoText, setMemoText] = useState();

  const handleCellEdit = useCallback(
    ({ id, value }) => {
      tableRows.some((row) => {
        if (row.id === id) {
          dispatch(setMemoList({ ...memo, [row.id]: value }));
          return true;
        }
        return false;
      });
    },
    [dispatch, memo, tableRows],
  );

  const handlePageSize = useCallback((currentSize) => {
    setPageSize(currentSize);
  }, []);

  const handleRemove = useCallback(() => {
    const updateData = tableRows.reduce((acc, row) => {
      if (selection.includes(row.id)) return acc;
      return { ...acc, [row.id]: row.memo };
    }, {});
    dispatch(setMemoList(updateData));
    setSelection([]);
  }, [dispatch, selection, tableRows]);

  const handleSelection = useCallback((current) => {
    setSelection(current);
  }, []);

  const handleTextChange = useCallback((e) => {
    setTextError(false);
    setMemoText(e.target.value);
  }, []);

  const handleTextMode = useCallback(() => {
    if (textMode) {
      try {
        const updatedMemo = memoText.split('\n').reduce((acc, row) => {
          if (!row) return acc;

          const [user, memoInfo] = row.split('::');
          if (!memoInfo) return acc;

          return { ...acc, [user]: memoInfo };
        }, {});
        dispatch(setMemoList(updatedMemo));
        setTextMode(false);
      } catch (error) {
        console.warn(error);
        setTextError(true);
      }
      return;
    }

    setMemoText(
      tableRows.reduce(
        (acc, row, index) =>
          `${acc}${index === 0 ? '' : '\n'}${row.id}::${row.memo}`,
        '',
      ),
    );
    setTextMode(true);
  }, [dispatch, memoText, tableRows, textMode]);

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText>메모 편집</ListItemText>
            <ListItemSecondaryAction>
              <Button
                startIcon={textMode ? <TableChart /> : <Subject />}
                onClick={handleTextMode}
              >
                {textMode
                  ? '테이블 편집 모드로 전환'
                  : '텍스트 편집 모드로 전환'}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            {!textMode && (
              <DataGrid
                rows={tableRows}
                columns={columns}
                autoHeight
                rowHeight={40}
                pagination
                checkboxSelection
                disableColumnMenu
                disableSelectionOnClick
                components={{
                  Toolbar: ConfigToolbar,
                  NoRowsOverlay: () => (
                    <GridOverlay>저장된 메모가 없습니다.</GridOverlay>
                  ),
                }}
                componentsProps={{
                  toolbar: {
                    disabled: selection.length === 0,
                    onRemove: handleRemove,
                  },
                }}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onPageSizeChange={handlePageSize}
                onCellEditCommit={handleCellEdit}
                onSelectionModelChange={handleSelection}
              />
            )}
            {textMode && (
              <TextField
                variant="outlined"
                fullWidth
                multiline
                minRows={6}
                maxRows={10}
                value={memoText}
                onChange={handleTextChange}
                error={textError}
              />
            )}
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
