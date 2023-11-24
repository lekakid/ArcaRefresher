import React, { Fragment, useCallback, useState } from 'react';
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
} from '@mui/material';
import { Remove, VolumeOff, VolumeUp } from '@mui/icons-material';
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
  $setChannel,
  $toggleMuteAllEmot,
} from '../slice';
import { emoticonTableSelector } from '../selector';
import CategoryRow from './CategoryRow';

const columns = [{ field: 'name', headerName: '이용자', flex: 1 }];

function ConfigToolbar({ disabled, muteAll, actionMuteAll, onRemove }) {
  const dispatch = useDispatch();

  const handleAllMute = useCallback(() => {
    dispatch(actionMuteAll());
  }, [dispatch, actionMuteAll]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        variant="text"
        startIcon={muteAll ? <VolumeOff /> : <VolumeUp />}
        onClick={handleAllMute}
      >
        전부 뮤트
      </Button>
      <Button
        variant="text"
        startIcon={<Remove />}
        disabled={disabled}
        onClick={onRemove}
      >
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
  const { channel: channelInfo, board: boardInfo } = useContent();
  const {
    mk2,
    contextRange,
    boardBarPos,
    hideCountBar,
    hideMutedMark,
    muteIncludeReply,
    hideServiceNotice,
    hideNoPermission,
    hideClosedDeal,
    user: userList,
    keyword: keywordList,
    channel: channelList,
    muteAllEmot,
    category: { [channelInfo.ID]: category },
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

  const onSaveChannel = useCallback(
    (text) => {
      const data = text.split('\n').filter((i) => i !== '');
      dispatch($setChannel(data));
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
          channel: channelInfo.ID,
          category: id,
          config: value,
        }),
      );
    },
    [channelInfo, dispatch],
  );

  return (
    <Fragment ref={ref}>
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
            primary="우클릭 메뉴 호출 범위"
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
            primary="뮤트 카운트 바 위치"
            value={boardBarPos}
            action={$setBoardBarPos}
          >
            <MenuItem value="afterbegin">게시판 위</MenuItem>
            <MenuItem value="afterend">게시판 아래</MenuItem>
          </SelectRow>
          <SwitchRow
            divider
            primary="뮤트 카운트 바 숨김"
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
            primary="검사할 닉네임"
            initialValue={userList.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            onSave={onSaveUser}
          />
          <TextEditorRow
            divider
            primary="검사할 키워드"
            initialValue={keywordList.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            onSave={onSaveKeyword}
          />
          <TextEditorRow
            divider
            primary="검사할 채널"
            secondary="모든 채널을 대상으로 하는 게시판(베스트 라이브 등)에서 동작합니다."
            initialValue={channelList.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            onSave={onSaveChannel}
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
                  muteAll: muteAllEmot,
                  actionMuteAll: $toggleMuteAllEmot,
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
            <Box sx={{ width: '100%' }}>
              <Paper variant="outlined">
                <Grid container>
                  {!boardInfo?.category && (
                    <Grid item xs={12}>
                      <Typography align="center">
                        카테고리를 확인할 수 없습니다.
                      </Typography>
                    </Grid>
                  )}
                  {boardInfo?.category &&
                    Object.entries(boardInfo.category).map(
                      ([id, label], index) => (
                        <CategoryRow
                          key={id}
                          divider={index !== 0}
                          id={id}
                          label={label}
                          initValue={category?.[id]}
                          onChange={handleCategory}
                        />
                      ),
                    )}
                </Grid>
              </Paper>
            </Box>
          </ListItem>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
