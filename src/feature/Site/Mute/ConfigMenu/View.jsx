import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';

import {
  DataGridRow,
  SelectRow,
  SwitchRow,
  TextFieldRow,
} from 'component/ConfigMenu';
import { useContent } from 'hooks/Content';

import Info from '../FeatureInfo';
import {
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
  $setContextRange,
  $setChannel,
  $setEmoticonList,
  $toggleMuteAllEmot,
} from '../slice';
import { emoticonTableSelector } from '../selector';
import CategoryRow from './CategoryRow';

const columns = [{ field: 'name', headerName: '이름', flex: 1 }];

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { channel, category } = useContent();

  const {
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
    category: { [channel.ID]: categoryConfig },
  } = useSelector((state) => state[Info.ID].storage);
  const emotRows = useSelector(emoticonTableSelector);

  const handleSaveFormat = useCallback((value) => {
    const result = value.split('\n').filter((i) => i);
    RegExp(result.join('|'));
    return result;
  }, []);

  const handleMutedEmotChange = useCallback(
    (rows) => {
      const entries = rows.map(({ id, name, bundle, url }) => [
        id,
        { name, bundle, url },
      ]);
      dispatch($setEmoticonList(Object.fromEntries(entries)));
    },
    [dispatch],
  );

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
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
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
          <SwitchRow
            divider
            primary="[공통] 뮤트 카운트 바 숨김"
            secondary="뮤트된 게시물이 몇개인지 표시되는 바를 제거합니다."
            value={hideCountBar}
            action={$toggleCountBar}
          />
          <SwitchRow
            divider
            primary="[공통] 뮤트 표시 숨김"
            secondary="변경 후 새로고침 필요"
            value={hideMutedMark}
            action={$toggleMutedMark}
          />
          <SelectRow
            divider
            primary="[게시판] 뮤트 카운트 바 위치"
            value={boardBarPos}
            action={$setBoardBarPos}
          >
            <MenuItem value="afterbegin">게시판 위</MenuItem>
            <MenuItem value="afterend">게시판 아래</MenuItem>
          </SelectRow>
          <SwitchRow
            primary="[댓글] 답글도 같이 뮤트"
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
          <TextFieldRow
            divider
            primary="검사할 닉네임"
            multiline
            manualSave
            value={userList.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            action={$setUser}
            saveFormat={handleSaveFormat}
          />
          <TextFieldRow
            divider
            primary="검사할 키워드"
            multiline
            manualSave
            value={keywordList.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            action={$setKeyword}
            saveFormat={handleSaveFormat}
          />
          <TextFieldRow
            divider
            primary="검사할 채널"
            secondary="모든 채널을 대상으로 하는 게시판(베스트 라이브 등)에서 동작합니다."
            multiline
            manualSave
            value={channelList.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            action={$setChannel}
            saveFormat={handleSaveFormat}
          />
          <SwitchRow
            divider
            primary="모든 아카콘 뮤트"
            value={muteAllEmot}
            action={$toggleMuteAllEmot}
          />
          <Collapse in={!muteAllEmot}>
            <DataGridRow
              primary="뮤트한 아카콘"
              columns={columns}
              rows={emotRows}
              noRowsText="뮤트된 아카콘이 없습니다."
              onChange={handleMutedEmotChange}
            />
          </Collapse>

          <ListItem>
            <ListItemText>카테고리 설정</ListItemText>
          </ListItem>
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Paper variant="outlined">
                <Grid container>
                  {category?.id2NameMap ? (
                    Object.entries(category.id2NameMap).map(
                      ([id, label], index) => (
                        <CategoryRow
                          key={id}
                          divider={index !== 0}
                          id={id}
                          label={label}
                          initValue={categoryConfig?.[id]}
                          onChange={handleCategory}
                        />
                      ),
                    )
                  ) : (
                    <Grid item xs={12}>
                      <Typography align="center">
                        카테고리를 확인할 수 없습니다.
                      </Typography>
                    </Grid>
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
