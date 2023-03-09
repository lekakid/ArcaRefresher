import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, List, Paper, Typography } from '@material-ui/core';

import { TableEditor } from 'component/config';
import { createSelector } from '@reduxjs/toolkit';
import Info from '../FeatureInfo';
import { $setColorList } from '../slice';

const columns = [
  { field: 'id', headerName: '이용자', flex: 1 },
  { field: 'color', headerName: '색상', flex: 1, editable: true },
];

const colorEntriesSelector = createSelector(
  (state) => state[Info.ID].storage,
  (color) => {
    Object.entries(color).map(([key, value]) => ({
      id: key,
      color: value,
    }));
  },
);

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const rows = useSelector(colorEntriesSelector);

  const handleEdit = useCallback(
    (updatedRows) => {
      const entries = updatedRows.map((row) => [row.id, row.color]);
      dispatch($setColorList(Object.fromEntries(entries)));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <TableEditor
            headerText="색상 편집"
            columns={columns}
            rows={rows}
            noRowsText="저장된 이용자가 없습니다."
            delimiter="::"
            onEdit={handleEdit}
          />
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
