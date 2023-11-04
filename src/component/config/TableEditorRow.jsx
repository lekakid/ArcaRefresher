import React, { useCallback, useState } from 'react';
import {
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@material-ui/core';
import { Remove, Subject, TableChart } from '@material-ui/icons';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';

function NoRowsOverlay(text) {
  return <GridOverlay>{text}</GridOverlay>;
}

function Toolbar({ disabled, onRemove }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <Button startIcon={<Remove />} disabled={disabled} onClick={onRemove}>
        삭제
      </Button>
    </div>
  );
}

const TableEditorRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function TableEditorRow(
    { divider, headerText, rows, columns, noRowsText, delimiter, onEdit },
    ref,
  ) {
    const [textMode, setTextMode] = useState(false);
    const [selection, setSelection] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [text, setText] = useState('');
    const [error, setError] = useState(false);

    const handleMode = useCallback(() => {
      if (textMode) {
        const textRows = text.split('\n').filter((e) => e !== '');
        const updatedRows = textRows.map((e) => {
          const entries = e
            .split(delimiter)
            .map((value, index) => [columns[index].field, value]);
          return Object.fromEntries(entries);
        });
        onEdit(updatedRows);
      } else {
        setText(
          rows.map((row) => Object.values(row).join(delimiter)).join('\n') ||
            '',
        );
      }
      setTextMode(!textMode);
    }, [columns, delimiter, onEdit, rows, text, textMode]);

    const handleSelection = useCallback((current) => {
      setSelection(current);
    }, []);

    const handleCellEdit = useCallback(
      ({ id, field, value }) => {
        const updatedRows = rows.map((row) =>
          row.id === id ? { ...row, [field]: value } : row,
        );
        onEdit?.(updatedRows);
      },
      [onEdit, rows],
    );

    const handleRemove = useCallback(() => {
      const updatedRows = rows.filter((row) => {
        if (selection.includes(row.id)) return false;
        return true;
      });
      onEdit?.(updatedRows);
    }, [onEdit, rows, selection]);

    const handlePageSize = useCallback((currentSize) => {
      setPageSize(currentSize);
    }, []);

    const handleTextChange = useCallback((e) => {
      setText(e.target.value);
      setError(false);
    }, []);

    return (
      <>
        <ListItem ref={ref}>
          <ListItemText>{headerText}</ListItemText>
          <ListItemSecondaryAction>
            <Button
              startIcon={textMode ? <TableChart /> : <Subject />}
              onClick={handleMode}
            >
              {textMode ? '테이블 편집 모드로 전환' : '텍스트 편집 모드로 전환'}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem ref={ref} divider={divider}>
          {!textMode && (
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
                NoRowsOverlay: () => NoRowsOverlay(noRowsText),
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
              value={text}
              onChange={handleTextChange}
              error={error}
            />
          )}
        </ListItem>
      </>
    );
  },
);

TableEditorRow.defaultProps = {
  headerText: '설정 이름',
  initialRows: [],
  delimiter: '::',
  errorText: '',
};

export default TableEditorRow;
