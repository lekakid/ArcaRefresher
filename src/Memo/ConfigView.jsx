import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Remove, Subject } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import ConfigGroup from '../$Config/ConfigGroup';

import { setMemoList } from './slice';

const columns = [
  { field: 'user', headerName: '이용자', flex: 1 },
  { field: 'memo', headerName: '메모', flex: 1, editable: true },
];

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 'md',
  },
}));

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
  const { memo } = useSelector((state) => state.Memo);
  const tableRows = Object.keys(memo).map((key, index) => ({
    id: index,
    user: key,
    memo: memo[key],
  }));
  const defaultText = tableRows.reduce(
    (acc, r, index) => `${acc}${index === 0 ? '' : '\n'}${r.user}::${r.memo}`,
    '',
  );
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [textMode, setTextMode] = useState(false);
  const [textError, setTextError] = useState(false);
  const [memoText, setMemoText] = useState(defaultText);

  const handleCellEdit = useCallback(
    ({ id, value }) => {
      tableRows.some((r) => {
        if (r.id === id) {
          dispatch(setMemoList({ ...memo, [r.user]: value }));
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
    const restRows = tableRows.filter(
      (m) => !selection.some((s) => s === m.id),
    );
    dispatch(
      setMemoList(
        restRows.reduce((acc, m) => ({ ...acc, [m.user]: m.memo }), {}),
      ),
    );
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
        const updatedMemo = memoText.split('\n').reduce((acc, r) => {
          const [u, m] = r.split('::');
          return { ...acc, [u]: m };
        }, {});
        dispatch(setMemoList(updatedMemo));
        setTextMode(false);
      } catch (error) {
        console.warn(error);
        setTextError(true);
      }
      return;
    }

    setTextMode(true);
  }, [dispatch, memoText, textMode]);

  const classes = useStyles();
  return (
    <ConfigGroup name="메모">
      <List className={classes.root}>
        <ListItem>
          <ListItemText>메모 편집</ListItemText>
        </ListItem>
        {!textMode && (
          <DataGrid
            rows={tableRows}
            columns={columns}
            loading={tableRows.length === 0}
            autoHeight
            rowHeight={40}
            pagination
            checkboxSelection
            disableColumnMenu
            disableSelectionOnClick
            components={{
              Toolbar: ConfigToolbar,
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
        <Button startIcon={<Subject />} onClick={handleTextMode}>
          텍스트 편집 모드
        </Button>
      </List>
    </ConfigGroup>
  );
}
