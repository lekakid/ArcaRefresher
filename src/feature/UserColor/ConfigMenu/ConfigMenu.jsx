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

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { setColor, setColorList } from '../slice';

const columns = [
  { field: 'id', headerName: '이용자', flex: 1 },
  { field: 'color', headerName: '색상', flex: 1, editable: true },
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

export default function ConfigMenu() {
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state[MODULE_ID]);
  const tableRows =
    Object.entries(color)?.map(([key, value]) => ({
      id: key,
      color: value,
    })) || {};
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [textMode, setTextMode] = useState(false);
  const [textError, setTextError] = useState(false);
  const [colorText, setColorText] = useState();

  const handleCellEdit = useCallback(
    ({ user, value }) => {
      tableRows.some((r) => {
        if (r.id === user) {
          dispatch(setColor({ user: r.id, color: value }));
          return true;
        }
        return false;
      });
    },
    [dispatch, tableRows],
  );

  const handlePageSize = useCallback((currentSize) => {
    setPageSize(currentSize);
  }, []);

  const handleRemove = useCallback(() => {
    const updateList = tableRows.reduce((acc, cur) => {
      if (selection.includes(cur.id)) return acc;
      return { ...acc, [cur.id]: cur.color };
    }, {});

    dispatch(setColorList(updateList));
    setSelection([]);
  }, [dispatch, selection, tableRows]);

  const handleSelection = useCallback((current) => {
    setSelection(current);
  }, []);

  const handleTextChange = useCallback((e) => {
    setTextError(false);
    setColorText(e.target.value);
  }, []);

  const handleTextMode = useCallback(() => {
    if (textMode) {
      try {
        const updateData = colorText.split('\n').reduce((acc, row) => {
          if (!row) return acc;

          const [id, colorInfo] = row.split('::');
          if (!colorInfo) return acc;

          return { ...acc, [id]: colorInfo };
        }, {});
        dispatch(setColorList(updateData));
        setTextMode(false);
      } catch (error) {
        console.warn(error);
        setTextError(true);
      }
      return;
    }

    setColorText(
      tableRows.reduce(
        (acc, row, index) =>
          `${acc}${index === 0 ? '' : '\n'}${row.id}::${row.color}`,
        '',
      ),
    );
    setTextMode(true);
  }, [dispatch, colorText, tableRows, textMode]);

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText>색상 편집</ListItemText>
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
                    <GridOverlay>저장된 이용자가 없습니다.</GridOverlay>
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
                value={colorText}
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
