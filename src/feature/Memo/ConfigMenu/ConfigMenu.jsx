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
import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { setMemoList, setVariant } from '../slice';

const columns = [
  { field: 'id', headerName: '이용자', flex: 1 },
  { field: 'memo', headerName: '메모', flex: 1, editable: true },
];

const ConfigMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ConfigMenu(_props, ref) {
    const dispatch = useDispatch();
    const { variant, memo } = useSelector((state) => state[MODULE_ID]);
    const rows = Object.keys(memo).map((key) => ({
      id: key,
      memo: memo[key],
    }));

    const handleVariant = useCallback(
      (e) => {
        dispatch(setVariant(e.target.value));
      },
      [dispatch],
    );

    const handleEdit = useCallback(
      (updatedRows) => {
        const updatedData = updatedRows.reduce(
          (acc, row) => ({ ...acc, [row.id]: row.memo }),
          {},
        );
        dispatch(setMemoList(updatedData));
      },
      [dispatch],
    );

    return (
      <Box ref={ref}>
        <Typography variant="subtitle1">{MODULE_NAME}</Typography>
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
  },
);

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
