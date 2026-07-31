import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid2 as Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Close, Delete, Done, Edit } from '@mui/icons-material';

import Info from '../FeatureInfo';
import {
  $setArticleList,
  setCurrentSlot,
  $toggleImportTitle,
  $toggleTemplateMode,
} from '../slice';

function Toolbar({
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
    <>
      <Grid container alignItems="center">
        <Grid size={{ xs: 8 }}>
          <Box sx={{ display: 'flex', px: '8px' }}>
            <Typography variant="caption">
              100개 이상 저장 시 전체적인 속도 저하가 있을 수 있습니다.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {toolButton}
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}

Toolbar.propTypes = {
  selection: PropTypes.array,
  editMode: PropTypes.bool,
  onClickEdit: PropTypes.func,
  onClickRemove: PropTypes.func,
  onClickDone: PropTypes.func,
};

function LoadTable({ editor, open, onClose }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { tempArticleList, importTitle, templateMode } = useSelector(
    (state) => state[Info.id].storage,
  );

  const rows = Object.entries(tempArticleList).map(([key, value], index) => ({
    id: index,
    title: value.title,
    content: value.content,
    date: key,
  }));

  const [selection, setSelection] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pagedRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [rows, page, pageSize],
  );

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

  const handleLoad = useCallback(
    (row) => {
      if (editMode) return;
      const { date, title, content } = row;

      editor.content.html.set(content);
      editor.content.events.trigger('contentChanged');
      if (importTitle) editor.title.value = title;

      setSelection([]);
      dispatch(setCurrentSlot(templateMode ? null : date));
      onClose();
    },
    [dispatch, editor, importTitle, templateMode, editMode, onClose],
  );

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
        <Paper variant="outlined" sx={{ width: '100%' }}>
          <Toolbar
            selection={selection}
            editMode={editMode}
            onClickEdit={handleEdit}
            onClickRemove={handleRemove}
            onClickDone={handleDone}
          />
          <Table>
            <TableHead>
              <TableRow sx={{ height: 40 }}>
                <TableCell padding="checkbox">
                  {editMode && (
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
                  )}
                </TableCell>
                <TableCell sx={{ flex: 3 }}>제목</TableCell>
                <TableCell sx={{ flex: 1 }}>날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedRows.length === 0 ? (
                <TableRow sx={{ height: 100 }}>
                  <TableCell colSpan={3} align="center">
                    임시 저장된 게시물이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                pagedRows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      height: 40,
                      cursor: editMode ? 'default' : 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                    onClick={() => handleLoad(row)}
                  >
                    <TableCell padding="checkbox">
                      {editMode && (
                        <Checkbox
                          checked={selection.includes(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row.id);
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>
                      {new Date(Number(row.date)).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[10, 20, 30]}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
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
