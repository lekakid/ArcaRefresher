import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { Remove } from '@material-ui/icons';

import { TextEditor } from 'component/config';
import { useParser } from 'util/Parser';
import Info from '../FeatureInfo';
import {
  removeEmoticonList,
  setKeyword,
  setUser,
  toggleCountBar,
  toggleMutedMark,
  toggleIncludeReply,
} from '../slice';
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
  const {
    channel: { category },
  } = useParser();
  const {
    config: {
      hideCountBar,
      hideMutedMark,
      muteIncludeReply,
      user,
      keyword,
      emoticon,
    },
  } = useSelector((state) => state[Info.ID]);
  const tableRows = Object.keys(emoticon).map((key) => ({
    id: key,
    name: emoticon[key].name,
    bundle: emoticon[key].bundle,
    url: emoticon[key].url,
  }));
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const handleCountBar = useCallback(() => {
    dispatch(toggleCountBar());
  }, [dispatch]);

  const handleMutedMark = useCallback(() => {
    dispatch(toggleMutedMark());
  }, [dispatch]);

  const handleIncludeReply = useCallback(() => {
    dispatch(toggleIncludeReply());
  }, [dispatch]);

  const onSaveUser = useCallback(
    (text) => {
      const test = text.split('\n').filter((i) => i !== '');
      RegExp(test.join('|'));
      dispatch(setUser(test));
    },
    [dispatch],
  );

  const onSaveKeyword = useCallback(
    (text) => {
      const test = text.split('\n').filter((i) => i !== '');
      RegExp(test.join('|'));
      dispatch(setKeyword(test));
    },
    [dispatch],
  );

  const handlePageSize = useCallback((currentSize) => {
    setPageSize(currentSize);
  }, []);

  const handleRemove = useCallback(() => {
    dispatch(removeEmoticonList(selection));
    setSelection([]);
  }, [dispatch, selection]);

  const handleSelection = useCallback((current) => {
    setSelection(current);
  }, []);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleCountBar}>
            <ListItemText
              primary="뮤트 카운터 숨김"
              secondary="뮤트된 게시물이 몇개인지 표시되는 바를 제거합니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={hideCountBar} onChange={handleCountBar} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleMutedMark}>
            <ListItemText
              primary="[뮤트됨] 표시 숨김"
              secondary="변경 후 새로고침 필요"
            />
            <ListItemSecondaryAction>
              <Switch checked={hideMutedMark} onChange={handleMutedMark} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleIncludeReply}>
            <ListItemText>댓글 뮤트 시 답글도 같이 뮤트</ListItemText>
            <ListItemSecondaryAction>
              <Switch
                checked={muteIncludeReply}
                onChange={handleIncludeReply}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <TextEditor
            divider
            headerText="검사할 닉네임"
            initialValue={user.join('\n')}
            errorText="정규식 조건을 위반하는 항목이 있습니다."
            onSave={onSaveUser}
          />
          <TextEditor
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
                {category &&
                  Object.keys(category).map((id, index) => (
                    <CategoryRow
                      key={id}
                      divider={index !== 0}
                      category={id}
                      nameMap={category}
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
