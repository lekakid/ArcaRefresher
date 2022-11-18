import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';

import { TableEditor } from 'component/config';
import Info from '../FeatureInfo';
import { $setMemoList, $setVariant } from '../slice';

const columns = [
  { field: 'id', headerName: '이용자', flex: 1 },
  { field: 'memo', headerName: '메모', flex: 1, editable: true },
];

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const {
    storage: { variant, memo },
  } = useSelector((state) => state[Info.ID]);
  const rows = Object.entries(memo).map(([key, value]) => ({
    id: key,
    memo: value,
  }));

  const handleVariant = useCallback(
    (e) => {
      dispatch($setVariant(e.target.value));
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (updatedRows) => {
      const entries = updatedRows.map((row) => [row.id, row.memo]);
      dispatch($setMemoList(Object.fromEntries(entries)));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider>
            <ListItemText>모양 선택</ListItemText>
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={variant}
                onChange={handleVariant}
              >
                <ListItem value="badge">둥근 뱃지</ListItem>
                <ListItem value="text">텍스트</ListItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <TableEditor
            headerText="저장된 메모"
            columns={columns}
            initialRows={rows}
            noRowsText="저장된 메모가 없습니다."
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
