import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Close, Delete, Done, Edit } from '@mui/icons-material';

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
      <Button variant="text" startIcon={<Edit />} onClick={onClickEdit}>
        편집
      </Button>
    );
  } else if (selection.length > 0) {
    toolButton = (
      <Button variant="text" startIcon={<Delete />} onClick={onClickRemove}>
        삭제
      </Button>
    );
  } else {
    toolButton = (
      <Button variant="text" startIcon={<Done />} onClick={onClickDone}>
        완료
      </Button>
    );
  }

  return (
    <Grid container alignItems="center">
      <Grid item xs={8}>
        <Box sx={{ display: 'flex', px: '8px' }}>
          <Typography variant="caption">
            100개 이상 저장 시 전체적인 속도 저하가 있을 수 있습니다.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {toolButton}
        </Box>
      </Grid>
    </Grid>
  );
}

CustomToolbar.propTypes = {
  selection: PropTypes.array.isRequired,
  editMode: PropTypes.bool.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onClickDone: PropTypes.func.isRequired,
};

function LoadTable({ editor, open, onClose }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

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
    ({ row }) => {
      const { date, title, content } = row;

      editor.content.html.set(content);
      editor.content.events.trigger('contentChanged');
      if (importTitle) editor.title.value = title;

      setSelection([]);
      dispatch(setCurrentSlot(templateMode ? null : date));
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
      <IconButton
        sx={{ position: 'absolute', right: 8, top: 8 }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
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
          selectionModel={selection}
          onSelectionModelChange={handleSelection}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction={mobile ? 'column' : 'row'}>
          <Tooltip
            placement="top"
            title="게시물을 불러올 때 기존 저장 데이터와 연결되지 않습니다."
          >
            <FormControlLabel
              control={
                <Switch checked={templateMode} onChange={handleTemplateMode} />
              }
              label="사본으로 불러오기"
            />
          </Tooltip>
          <FormControlLabel
            control={
              <Switch checked={importTitle} onChange={handleImportTitle} />
            }
            label="제목 포함"
          />
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

LoadTable.propTypes = {
  editor: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoadTable;
