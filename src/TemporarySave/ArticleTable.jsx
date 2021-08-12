import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  Switch,
} from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { Close, Delete, Done, Edit } from '@material-ui/icons';

import { MODULE_ID } from './ModuleInfo';
import {
  setArticleList,
  setCurrentSlot,
  toggleImportTitle,
  toggleLoadDialog,
} from './slice';

const columns = [
  { field: 'title', headerName: '제목', flex: 3 },
  {
    field: 'date',
    headerName: '날짜',
    flex: 1,
    valueFormatter: (params) =>
      `${new Date(Number(params.value)).toLocaleString()}`,
  },
];

const useStyles = makeStyles({
  label: {
    marginBottom: 0,
  },
});

function CustomToolbar({
  selection,
  editMode,
  importTitle,
  onToggle,
  onRemove,
  onDone,
  onClickImportTitle,
}) {
  const classes = useStyles();
  let toolButton;

  if (!editMode) {
    toolButton = (
      <Button startIcon={<Edit />} onClick={onToggle}>
        편집
      </Button>
    );
  } else if (selection.length > 0) {
    toolButton = (
      <Button startIcon={<Delete />} onClick={onRemove}>
        삭제
      </Button>
    );
  } else {
    toolButton = (
      <Button startIcon={<Done />} onClick={onDone}>
        완료
      </Button>
    );
  }

  return (
    <div style={{ textAlign: 'right' }}>
      <FormControlLabel
        control={<Switch checked={importTitle} onChange={onClickImportTitle} />}
        label="제목 포함"
        className={classes.label}
      />
      {toolButton}
    </div>
  );
}

export default function ArticleTable() {
  const dispatch = useDispatch();
  const { titleInput, editor, tempArticleList, importTitle, loadDialogOpen } =
    useSelector((state) => state[MODULE_ID]);
  const rows = Object.keys(tempArticleList).map((key, index) => ({
    id: index,
    title: tempArticleList[key].title,
    content: tempArticleList[key].content,
    date: key,
  }));
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [editMode, setEditMode] = useState(false);

  const handleSelection = useCallback((current) => {
    setSelection(current);
  }, []);

  const handleLoad = useCallback(
    (params) => {
      const date = params.getValue(params.id, 'date');
      const title = params.getValue(params.id, 'title');
      const content = params.getValue(params.id, 'content');

      editor.html.set(content);
      if (importTitle) titleInput.value = title;

      setSelection([]);
      dispatch(setCurrentSlot(date));
      dispatch(toggleLoadDialog());
    },
    [dispatch, editor, importTitle, titleInput],
  );

  const handlePageSize = useCallback((currentSize) => {
    setPageSize(currentSize);
  }, []);

  const handleClose = useCallback(() => {
    setSelection([]);
    setEditMode(false);
    dispatch(toggleLoadDialog());
  }, [dispatch]);

  const handleImportTitle = useCallback(() => {
    dispatch(toggleImportTitle());
  }, [dispatch]);

  const handleToggle = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleRemove = useCallback(() => {
    const newArticleList = rows.reduce((acc, { id, date, title, content }) => {
      if (selection.some((s) => s === id)) return acc;

      return {
        ...acc,
        [date]: { title, content },
      };
    }, {});

    dispatch(setArticleList(newArticleList));
  }, [dispatch, rows, selection]);

  const handleDone = useCallback(() => {
    setEditMode(false);
  }, []);

  return (
    <Dialog fullWidth maxWidth="md" open={loadDialogOpen} onClose={handleClose}>
      <DialogTitle>불러오기</DialogTitle>
      <DialogContent>
        <DataGrid
          columns={columns}
          rows={rows}
          autoHeight
          rowHeight={40}
          pagination
          checkboxSelection={editMode}
          disableColumnMenu
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay: () => (
              <GridOverlay>임시 저장된 게시물이 없습니다.</GridOverlay>
            ),
          }}
          componentsProps={{
            toolbar: {
              selection,
              editMode,
              importTitle,
              onToggle: handleToggle,
              onRemove: handleRemove,
              onDone: handleDone,
              onClickImportTitle: handleImportTitle,
            },
          }}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 20, 30]}
          onPageSizeChange={handlePageSize}
          onRowClick={editMode ? null : handleLoad}
          onSelectionModelChange={handleSelection}
        />
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Close />} onClick={handleClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
