import React, { useCallback, useEffect, useState } from 'react';
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
  rows,
  columns,
  textEditable,
  noRowsText,
  onModeChange,
  onChange,
}) {
  const [selection, setSelection] = useState([]);

  const handleCellEdit = useCallback(
    ({ id, field, value }) => {
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      );
      onChange(updatedRows);
    },
    [rows, onChange],
  );

  const handleSelection = useCallback((current) => {
    setSelection(current);
  }, []);

  const handleRemove = useCallback(() => {
    onChange(rows.filter((row) => !selection.includes(row.id)));
  }, [rows, selection, onChange]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      rowHeight={40}
      pagination
      checkboxSelection
      disableColumnMenu
      disableSelectionOnClick
      components={{
        Toolbar,
        NoRowsOverlay,
      }}
      componentsProps={{
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
          pageSize: 10,
        },
      }}
      rowsPerPageOptions={[10, 25, 50, 100]}
      onCellEditCommit={handleCellEdit}
      onSelectionModelChange={handleSelection}
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
        componentsProps={{ input: { sx: { padding: '8.5px 14px' } } }}
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

const DataGridRow = React.forwardRef(
  (
    {
      divider,
      nested,
      primary,
      secondary,
      rows,
      columns,
      textEditable,
      noRowsText,
      onChange,
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
            onChange={onChange}
            onModeChange={handleMode}
          />
        ) : (
          <TableView
            rows={rows}
            columns={columns}
            textEditable={textEditable}
            noRowsText={noRowsText}
            onModeChange={handleMode}
            onChange={onChange}
          />
        )}
      </BaseRow>
    );
  },
);

const rowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  rows: PropTypes.array,
  columns: PropTypes.array,
  textEditable: PropTypes.bool,
  noRowsText: PropTypes.string,
  onChange: PropTypes.func,
};

DataGridRow.propTypes = rowPropTypes;

export default DataGridRow;
