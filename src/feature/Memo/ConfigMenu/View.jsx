import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';
import streamSaver from 'streamsaver';

import { TableEditor } from 'component/config';
import { createSelector } from '@reduxjs/toolkit';
import Info from '../FeatureInfo';
import { $setMemoList, $setVariant } from '../slice';

const columns = [
  { field: 'id', headerName: '이용자', flex: 1 },
  { field: 'memo', headerName: '메모', flex: 1, editable: true },
];

const memoEntriesSelector = createSelector(
  (state) => state[Info.ID].storage.memo,
  (memo) =>
    Object.entries(memo).map(([key, value]) => ({
      id: key,
      memo: value,
    })),
);

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const variant = useSelector((state) => state[Info.ID].storage.variant);
  const memoRows = useSelector(memoEntriesSelector);
  const inputRef = useRef();

  const handleVariant = useCallback(
    (e) => {
      dispatch($setVariant(e.target.value));
    },
    [dispatch],
  );

  const handleImportMobile = useCallback(
    (e) => {
      (async () => {
        try {
          const path = e.target.files[0];
          const data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = JSON.parse(reader.result);
              resolve(result);
            };
            reader.readAsText(path);
          });

          const memoList = data.data;
          const memoEntries = memoList
            .map(({ userType, memoKey, memoText }) => {
              switch (userType) {
                case 1:
                  return [`#${memoKey}`, memoText];
                case 0:
                case 2:
                  return [memoKey, memoText];
                default:
                  return [];
              }
            })
            .filter((m) => m.length > 0);

          dispatch($setMemoList(Object.fromEntries(memoEntries)));
        } catch (error) {
          console.error(error);
        }
      })();
    },
    [dispatch],
  );

  const handleExportMobile = useCallback(() => {
    const ipRegex = /^[0-9]{1,3}\.[0-9]{1,3}$/;
    const data = memoRows.map(({ id, memo }) => {
      const row = {
        userType: 0,
        memoKey: id.replace('#', ''),
        memoValue: memo,
      };

      if (ipRegex.test(id)) row.userType = 2;
      if (id.startsWith('#')) row.userType = 1;

      return row;
    });
    const mobileJson = {
      version: 1,
      data,
    };

    const blob = new Blob([JSON.stringify(mobileJson)], { type: 'text/plain' });
    const rs = blob.stream();
    const filestream = streamSaver.createWriteStream('ArcaRefresher-memo.json');
    return rs.pipeTo(filestream);
  }, [memoRows]);

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
          <ListItem divider>
            <input
              ref={inputRef}
              type="file"
              accept=".json, .txt"
              onChange={handleImportMobile}
              style={{ display: 'none' }}
            />
            <ListItemText
              primary="공앱 메모 데이터"
              secondary="공앱 포맷에 맞는 파일로 내보내거나 가져옵니다."
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                style={{
                  marginRight: 4,
                }}
                onClick={() => inputRef.current.click()}
              >
                가져오기
              </Button>
              <Button
                variant="outlined"
                disabled={memoRows.length === 0}
                onClick={handleExportMobile}
              >
                내보내기
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <TableEditor
            headerText="저장된 메모"
            columns={columns}
            rows={memoRows}
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
