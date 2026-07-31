import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  InputBase,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Remove, Subject, TableChart } from '@mui/icons-material';

import BaseRow from './BaseRow';

const DELIMITER = '::';

/* eslint-disable react/prop-types */

function Toolbar({ textEditable, removeDisabled, onModeChange, onRemove }) {
  return (
    <>
      <Stack direction="row">
        <Stack sx={{ flexGrow: 1 }} direction="row">
          {textEditable && (
            <Button
              variant="text"
              startIcon={<Subject />}
              onClick={onModeChange}
            >
              텍스트 편집 모드로 전환
            </Button>
          )}
        </Stack>
        <Button
          variant="text"
          startIcon={<Remove />}
          disabled={removeDisabled}
          onClick={onRemove}
        >
          삭제
        </Button>
      </Stack>
      <Divider />
    </>
  );
}

function TableView({
  textEditable,
  noRowsText,
  columns,
  columnVisibilityModel,
  rows,
  onModeChange,
  onChangeRow,
  onChangeRows,
}) {
  const [selection, setSelection] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingCell, setEditingCell] = useState(null); // { rowId, field }
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);

  const visibleColumns = useMemo(
    () => columns.filter((col) => columnVisibilityModel?.[col.field] !== false),
    [columns, columnVisibilityModel],
  );

  const pagedRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [rows, page, pageSize],
  );

  const handleSelectAll = useCallback(
    (e) => {
      setSelection(e.target.checked ? rows.map((r) => r.id) : []);
    },
    [rows],
  );

  const handleSelectRow = useCallback((id) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }, []);

  const handleRemove = useCallback(() => {
    onChangeRows(rows.filter((row) => !selection.includes(row.id)));
    setSelection([]);
  }, [rows, selection, onChangeRows]);

  const handleCellClick = useCallback((rowId, field, editable) => {
    if (editable) setEditingCell({ rowId, field });
  }, []);

  const handleCellBlur = useCallback(
    (row, field, value) => {
      setEditingCell(null);
      if (row[field] !== value) {
        onChangeRow({ ...row, [field]: value });
      }
    },
    [onChangeRow],
  );

  const renderCellContent = (col, row, isEditing) => {
    if (isEditing) {
      return (
        <input
          ref={editInputRef}
          defaultValue={row[col.field]}
          onBlur={(e) => handleCellBlur(row, col.field, e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: 'inherit',
          }}
        />
      );
    }
    if (col.renderCell) {
      return col.renderCell({ row, value: row[col.field] });
    }
    return (
      <Box sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {row[col.field]}
      </Box>
    );
  };

  return (
    <Paper variant="outlined" sx={{ width: '100%' }}>
      <Toolbar
        textEditable={textEditable}
        removeDisabled={selection.length === 0}
        onModeChange={onModeChange}
        onRemove={handleRemove}
      />
      <Table size="small">
        <TableHead>
          <TableRow sx={{ height: 40 }}>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selection.length > 0 && selection.length < rows.length
                }
                checked={rows.length > 0 && selection.length === rows.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            {visibleColumns.map((col) => (
              <TableCell key={col.field} sx={{ width: col.width }}>
                {col.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pagedRows.length === 0 ? (
            <TableRow sx={{ height: 120 }}>
              <TableCell colSpan={visibleColumns.length + 1} align="center">
                {noRowsText}
              </TableCell>
            </TableRow>
          ) : (
            pagedRows.map((row) => (
              <TableRow key={row.id} sx={{ height: 40 }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selection.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </TableCell>
                {visibleColumns.map((col) => {
                  const isEditing =
                    editingCell?.rowId === row.id &&
                    editingCell?.field === col.field;
                  return (
                    <TableCell
                      key={col.field}
                      sx={{
                        maxWidth: 0,
                      }}
                      onClick={() =>
                        handleCellClick(row.id, col.field, col.editable)
                      }
                    >
                      {renderCellContent(col, row, isEditing)}
                    </TableCell>
                  );
                })}
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
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}

function TextView({ rows, columns, onChange, onModeChange }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(false);

  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleExit = useCallback(() => {
    try {
      const rowStrings = text.split('\n');
      const nextRows = rowStrings.map((rowString) => {
        const entries = rowString
          .split(DELIMITER)
          .map((value, index) => [columns[index].field, value]);
        return Object.fromEntries(entries);
      });
      onChange(nextRows);
      onModeChange();
    } catch (_error) {
      console.warn(_error);
      setError(true);
    }
  }, [columns, text, onChange, onModeChange]);

  useEffect(() => {
    setText(
      rows.map((row) => Object.values(row).join(DELIMITER)).join('\n') || '',
    );
  }, [rows]);

  return (
    <Paper variant="outlined" sx={{ width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Button variant="text" startIcon={<TableChart />} onClick={handleExit}>
          테이블 편집 모드로 전환
        </Button>
      </Stack>
      <Divider />
      <InputBase
        fullWidth
        slotProps={{ input: { sx: { padding: '8.5px 14px' } } }}
        multiline
        minRows={6}
        maxRows={6}
        error={error}
        value={text}
        onChange={handleChange}
      />
    </Paper>
  );
}
/* eslint-enable react/prop-types */

const DataGridRow = forwardRef(
  (
    {
      divider,
      nested,
      primary,
      secondary,
      rows,
      columns,
      columnVisibilityModel,
      textEditable,
      noRowsText,
      onChangeRow,
      onChangeRows,
    },
    ref,
  ) => {
    const [textMode, setTextMode] = useState(false);

    const handleMode = useCallback(() => {
      setTextMode(!textMode);
    }, [textMode]);

    return (
      <BaseRow
        ref={ref}
        divider={divider}
        nested={nested}
        column="always"
        header={<ListItemText primary={primary} secondary={secondary} />}
      >
        {textMode ? (
          <TextView
            rows={rows}
            columns={columns}
            onChange={onChangeRows}
            onModeChange={handleMode}
          />
        ) : (
          <TableView
            rows={rows}
            columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            textEditable={textEditable}
            noRowsText={noRowsText}
            onModeChange={handleMode}
            onChangeRow={onChangeRow}
            onChangeRows={onChangeRows}
          />
        )}
      </BaseRow>
    );
  },
);

DataGridRow.propTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  rows: PropTypes.array,
  columns: PropTypes.array,
  columnVisibilityModel: PropTypes.object,
  textEditable: PropTypes.bool,
  noRowsText: PropTypes.string,
  onChangeRow: PropTypes.func,
  onChangeRows: PropTypes.func,
};

export default DataGridRow;
