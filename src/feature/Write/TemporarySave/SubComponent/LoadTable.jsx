import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Close, Delete, Done, Edit } from '@material-ui/icons';

import Info from '../FeatureInfo';
import {
  $setArticleList,
  setCurrentSlot,
  $toggleImportTitle,
  $toggleTemplateMode,
} from '../slice';

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

function CustomNoRowsOverlay() {
  return <GridOverlay>임시 저장된 게시물이 없습니다.</GridOverlay>;
}

function CustomToolbar({
  selection,
  editMode,
  onClickEdit,
  onClickRemove,
  onClickDone,
}) {
  let toolButton;

  if (!editMode) {
    toolButton = (
      <Button startIcon={<Edit />} onClick={onClickEdit}>
        편집
      </Button>
    );
  } else if (selection.length > 0) {
    toolButton = (
      <Button startIcon={<Delete />} onClick={onClickRemove}>
        삭제
      </Button>
    );
  } else {
    toolButton = (
      <Button startIcon={<Done />} onClick={onClickDone}>
        완료
      </Button>
    );
  }

  return (
    <Grid container alignItems="center">
      <Grid item xs={8}>
        <Box display="flex" px={1}>
          <Typography variant="caption">
            100개 이상 저장 시 전체적인 속도 저하가 있을 수 있습니다.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" justifyContent="flex-end">
          {toolButton}
        </Box>
      </Grid>
    </Grid>
  );
}

export default function LoadTable({ editor, open, onClose }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { tempArticleList, importTitle, templateMode } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const rows = Object.entries(tempArticleList).map(([key, value], index) => ({
    id: index,
    title: value.title,
    content: value.content,
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

      editor.content.html.set(content);
      if (importTitle) editor.title.value = title;

      setSelection([]);
      if (!templateMode) dispatch(setCurrentSlot(date));
      onClose();
    },
    [dispatch, editor, importTitle, templateMode, onClose],
  );

  const handlePageSize = useCallback((currentSize) => {
    setPageSize(currentSize);
  }, []);

  const handleClose = useCallback(() => {
    setSelection([]);
    setEditMode(false);
    onClose();
  }, [onClose]);

  const handleTemplateMode = useCallback(() => {
    dispatch($toggleTemplateMode());
  }, [dispatch]);

  const handleImportTitle = useCallback(() => {
    dispatch($toggleImportTitle());
  }, [dispatch]);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleRemove = useCallback(() => {
    const newArticleEntries = rows
      .filter((row) => !selection.includes(row.id))
      .map(({ date, title, content }) => [date, { title, content }]);

    dispatch($setArticleList(Object.fromEntries(newArticleEntries)));
    setSelection([]);
    setEditMode(false);
  }, [dispatch, rows, selection]);

  const handleDone = useCallback(() => {
    setEditMode(false);
  }, []);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
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
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          componentsProps={{
            toolbar: {
              selection,
              editMode,
              onClickEdit: handleEdit,
              onClickRemove: handleRemove,
              onClickDone: handleDone,
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
        <Tooltip
          placement="top"
          title="게시물을 불러올 때 기존 저장 데이터와 연결되지 않습니다."
        >
          <FormControlLabel
            control={
              <Switch checked={templateMode} onChange={handleTemplateMode} />
            }
            label="템플릿 모드"
            className={classes.label}
          />
        </Tooltip>
        <FormControlLabel
          control={
            <Switch checked={importTitle} onChange={handleImportTitle} />
          }
          label="제목 포함"
          className={classes.label}
        />
        <Button variant="outlined" startIcon={<Close />} onClick={handleClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
