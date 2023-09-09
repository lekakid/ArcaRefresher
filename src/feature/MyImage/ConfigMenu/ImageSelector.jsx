import React, { useCallback, useState } from 'react';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';

const columns = [
  { field: 'url', headerName: '이미지 주소', flex: 1 },
  { field: 'memo', headerName: '메모', flex: 1, editable: true },
];

function NoRowsOverlay() {
  return <GridOverlay>저장된 자짤이 없습니다.</GridOverlay>;
}

export default function ImageSelector({ rows, disabled, onSelect, onEdit }) {
  const [pageSize, setPageSize] = useState(10);

  const handleSelection = useCallback(
    (current) => {
      onSelect(current);
    },
    [onSelect],
  );

  const handleCellEdit = useCallback(
    ({ id, field, value }) => {
      const updatedRows = rows.map((row) =>
        row.url === id ? { ...row, [field]: value } : row,
      );
      onEdit?.(updatedRows);
    },
    [onEdit, rows],
  );

  const handlePageSize = useCallback((currentSize) => {
    setPageSize(currentSize);
  }, []);

  return (
    <DataGrid
      rows={rows}
      getRowId={(row) => row.url}
      columns={columns}
      autoHeight
      rowHeight={40}
      pagination
      checkboxSelection={!disabled}
      disableColumnMenu
      disableSelectionOnClick
      components={{
        NoRowsOverlay,
      }}
      pageSize={pageSize}
      rowsPerPageOptions={[10, 25, 50, 100]}
      onPageSizeChange={handlePageSize}
      onCellEditCommit={handleCellEdit}
      onSelectionModelChange={handleSelection}
    />
  );
}
