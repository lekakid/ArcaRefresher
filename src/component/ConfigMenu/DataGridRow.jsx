import { forwardRef, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  InputBase,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import { Remove, Subject, TableChart } from '@mui/icons-material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';

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

function NoRowsOverlay({ noRowsText }) {
  return <GridOverlay>{noRowsText}</GridOverlay>;
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

  const handleUpdateRow = useCallback(
    (updateRow) => {
      onChangeRow(updateRow);
      return updateRow;
    },
    [onChangeRow],
  );

  const handleSelection = useCallback((current) => {
    setSelection(current);
  }, []);

  const handleRemove = useCallback(() => {
    onChangeRows(rows.filter((row) => !selection.includes(row.id)));
  }, [rows, selection, onChangeRows]);

  return (
    <DataGrid
      columns={columns}
      columnVisibilityModel={columnVisibilityModel}
      rowHeight={40}
      pagination
      checkboxSelection
      disableColumnMenu
      disableRowSelectionOnClick
      sx={{
        width: '100%',
      }}
      slots={{
        toolbar: Toolbar,
        noRowsOverlay: NoRowsOverlay,
      }}
      slotProps={{
        toolbar: {
          textEditable,
          removeDisabled: !(selection.length > 0),
          onModeChange,
          onRemove: handleRemove,
        },
        noRowsOverlay: {
          noRowsText,
        },
      }}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      rows={rows}
      processRowUpdate={handleUpdateRow}
      onRowSelectionModelChange={handleSelection}
    />
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
