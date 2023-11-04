import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from '@material-ui/core';
import { Remove } from '@material-ui/icons';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';

import { SelectRow, SwitchRow, TextEditorRow } from 'component/config';
import { useContent } from 'hooks/Content';

import Info from '../FeatureInfo';
import {
  $removeEmoticonList,
  $setKeyword,
  $setUser,
  $toggleHideNoPermission,
  $toggleCountBar,
  $toggleMutedMark,
  $toggleIncludeReply,
  $setCategoryConfig,
  $setBoardBarPos,
  $toggleHideNoticeService,
  $toggleHideClosedDeal,
  $toggleMK2,
  $setContextRange,
} from '../slice';
import { emoticonTableSelector } from '../selector';
import CategoryRow from './CategoryRow';

const columns = [{ field: 'name', headerName: '이용자', flex: 1 }];

function ConfigToolbar({ disabled, onRemove }) {
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button startIcon={<Remove />} disabled={disabled} onClick={onRemove}>
        삭제
      </Button>
    </Box>
  );
}

function CustomOverRay() {
  return <GridOverlay>뮤트된 아카콘이 없습니다.</GridOverlay>;
}

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { channel, board } = useContent();
  const {
    mk2,
    contextRange,
    hideServiceNotice,
    hideNoPermission,
    hideClosedDeal,
    boardBarPos,
    hideCountBar,
    hideMutedMark,
    muteIncludeReply,
    user,
    keyword,
    category: { [channel.ID]: category },
  } = useSelector((state) => state[Info.ID].storage);
  const tableRows = useSelector(emoticonTableSelector);
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const onSaveUser = useCallback(
    (text) => {
      const test = text.split('\n').filter((i) => i !== '');
      RegExp(test.join('|'));
      dispatch($setUser(test));
    },
    [dispatch],
  );

  const onSaveKeyword = useCallback(
    (text) => {
      const test = text.split('\n').filter((i) => i !== '');
      RegExp(test.join('|'));
      dispatch($setKeyword(test));
    },
    [dispatch],
  );

  const handlePageSize = useCallback((currentSize) => {
    setPageSize(currentSize);
  }, []);

  const handleRemove = useCallback(() => {
    dispatch($removeEmoticonList(selection));
    setSelection([]);
  }, [dispatch, selection]);

  const handleSelection = useCallback((current) => {
    setSelection(current);
  }, []);

  const handleCategory = useCallback(
    (id, value) => {
      dispatch(
        $setCategoryConfig({
          channel: channel.ID,
          category: id,
          config: value,
        }),
      );
    },
    [channel, dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="알림 뮤트 MK.2 (실험적)"
            secondary="뮤트 기능을 소켓 단계에서 막는 걸로 변경합니다."
            value={mk2}
            action={$toggleMK2}
          />
          <SelectRow
            primary="메뉴 호출 방식"
            value={contextRange}
            action={$setContextRange}
          >
            <MenuItem value="articleItem">게시글</MenuItem>
            <MenuItem value="nickname">닉네임</MenuItem>
          </SelectRow>
        </List>
      </Paper>
      <Typography variant="subtitle2">모양 설정</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            divider
            primary="메뉴 호출 방식"
            value={boardBarPos}
            action={$setBoardBarPos}
          >
            <MenuItem value="afterbegin">게시판 위</MenuItem>
            <MenuItem value="afterend">게시판 아래</MenuItem>
          </SelectRow>
          <SwitchRow
            divider
            primary="뮤트 카운터 숨김"
            secondary="뮤트된 게시물이 몇개인지 표시되는 바를 제거합니다."
            value={hideCountBar}
            action={$toggleCountBar}
          />
          <SwitchRow
            divider
            primary="[뮤트됨] 표시 숨김"
            secondary="변경 후 새로고침 필요"
            value={hideMutedMark}
            action={$toggleMutedMark}
          />
          <SwitchRow
            primary="댓글 뮤트 시 답글도 같이 뮤트"
            value={muteIncludeReply}
            action={$toggleIncludeReply}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">특정 컨텐츠</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="[모든 채널] 서비스 공지사항 숨김"
            value={hideServiceNotice}
            action={$toggleHideNoticeService}
          />
          <SwitchRow
            divider
            primary="[모든 채널] 운영 관련(권한 없음) 숨김"
            value={hideNoPermission}
            action={$toggleHideNoPermission}
          />
          <SwitchRow
            primary="[핫딜 채널] 식은딜 숨김"
            value={hideClosedDeal}
            action={$toggleHideClosedDeal}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">뮤트 조건</Typography>
      <Paper>
        <List disablePadding>
          <TextEditorRow
            divider
            headerText="검사할 닉네임"
            initialValue={user.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            onSave={onSaveUser}
          />
          <TextEditorRow
            divider
            headerText="검사할 키워드"
            initialValue={keyword.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            onSave={onSaveKeyword}
          />
          <ListItem>
            <ListItemText>뮤트된 아카콘 목록</ListItemText>
          </ListItem>
          <ListItem divider>
            <DataGrid
              rows={tableRows}
              columns={columns}
              autoHeight
              rowHeight={40}
              pagination
              checkboxSelection
              disableColumnMenu
              disableSelectionOnClick
              components={{
                Toolbar: ConfigToolbar,
                NoRowsOverlay: CustomOverRay,
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
              onSelectionModelChange={handleSelection}
            />
          </ListItem>
          <ListItem>
            <ListItemText>카테고리 설정</ListItemText>
          </ListItem>
          <ListItem>
            <Paper variant="outlined">
              <Grid container>
                {board.category &&
                  Object.entries(board.category).map(([id, label], index) => (
                    <CategoryRow
                      key={id}
                      divider={index !== 0}
                      id={id}
                      label={label}
                      initValue={category?.[id]}
                      onChange={handleCategory}
                    />
                  ))}
              </Grid>
            </Paper>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
