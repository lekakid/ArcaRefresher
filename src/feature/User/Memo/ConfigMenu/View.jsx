import React, { Fragment, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import streamSaver from 'streamsaver';
import { createSelector } from '@reduxjs/toolkit';

import { SelectRow, TableEditorRow } from 'component/config';
import Info from '../FeatureInfo';
import { $setContextRange, $setMemoList, $setVariant } from '../slice';

const columns = [
  { field: 'id', headerName: '이용자', flex: 1 },
  { field: 'msg', headerName: '메모 메세지', flex: 1, editable: true },
  { field: 'color', headerName: '메모 색상', flex: 1, editable: true },
];

const memoEntriesSelector = createSelector(
  (state) => state[Info.ID].storage.memo,
  (memo) =>
    Object.entries(memo).map(([key, { msg = '', color = '' }]) => ({
      id: key,
      msg,
      color,
    })),
);

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { variant, contextRange } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const memoData = useSelector((state) => state[Info.ID].storage.memo);
  const memoRows = useSelector(memoEntriesSelector);
  const inputRef = useRef();

  const handleImportMobile = useCallback(
    (e) => {
      (async () => {
        try {
          const path = e.target.files[0];
          const memoList = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = JSON.parse(reader.result);
              resolve(result.data);
            };
            reader.readAsText(path);
          });

          const updateData = { ...memoData };
          memoList.forEach(({ userType, memoKey, memoText }) => {
            switch (userType) {
              case 1:
                (updateData[`#${memoKey}`] ??= {}).msg = memoText;
                break;
              case 0:
              case 2:
                (updateData[memoKey] ??= {}).msg = memoText;
                break;
              default:
                break;
            }
          });

          dispatch($setMemoList(updateData));
        } catch (error) {
          console.error(error);
        }
      })();
    },
    [dispatch, memoData],
  );

  const handleExportMobile = useCallback(() => {
    const ipRegex = /^[0-9]{1,3}\.[0-9]{1,3}$/;
    const data = memoRows.map(({ id, msg }) => {
      const row = {
        userType: 0,
        memoKey: id.replace('#', ''),
        memoText: msg,
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
      const entries = updatedRows.map(({ id, msg, color }) => [
        id,
        { msg, color },
      ]);
      dispatch($setMemoList(Object.fromEntries(entries)));
    },
    [dispatch],
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            divider
            primary="우클릭 메뉴 호출 범위"
            value={contextRange}
            action={$setContextRange}
          >
            <MenuItem value="articleItem">게시글</MenuItem>
            <MenuItem value="nickname">닉네임</MenuItem>
          </SelectRow>
          <SelectRow
            divider
            primary="메모 모양"
            value={variant}
            action={$setVariant}
          >
            <MenuItem value="badge">둥근 뱃지</MenuItem>
            <MenuItem value="text">텍스트</MenuItem>
            <MenuItem value="none">없음</MenuItem>
          </SelectRow>
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
                sx={{
                  marginRight: 0.5,
                }}
                onClick={() => inputRef.current.click()}
              >
                가져오기
              </Button>
              <Button
                disabled={memoRows.length === 0}
                onClick={handleExportMobile}
              >
                내보내기
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <TableEditorRow
            headerText="저장된 메모"
            columns={columns}
            rows={memoRows}
            noRowsText="저장된 메모가 없습니다."
            delimiter="::"
            onEdit={handleEdit}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
