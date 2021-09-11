import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { Close, Remove, Save } from '@material-ui/icons';

import { useElementQuery } from 'core/hooks';
import { BOARD_LOADED } from 'core/selector';
import { getCategory } from 'util/parser';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import {
  removeEmoticonList,
  setKeyword,
  setUser,
  toggleCountBar,
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

function ConfigMenu() {
  const dispatch = useDispatch();
  const { hideCountBar, muteIncludeReply, user, keyword, emoticon } =
    useSelector((state) => state[MODULE_ID]);
  const tableRows = Object.keys(emoticon).map((key) => ({
    id: key,
    name: emoticon[key].name,
    bundle: emoticon[key].bundle,
    url: emoticon[key].url,
  }));
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const [textUser, setTextUser] = useState(user.join('\n'));
  const [textKeyword, setTextKeyword] = useState(keyword.join('\n'));
  const [errorUser, setErrorUser] = useState(false);
  const [errorKeyword, setErrorKeyword] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [nameMap, setNameMap] = useState({});

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    setNameMap(getCategory());
  }, [boardLoaded]);

  const handleCountBar = useCallback(() => {
    dispatch(toggleCountBar());
  }, [dispatch]);

  const handleIncludeReply = useCallback(() => {
    dispatch(toggleIncludeReply());
  }, [dispatch]);

  const handleUser = useCallback((e) => {
    setErrorUser(false);
    setTextUser(e.target.value);
  }, []);

  const handleKeyword = useCallback((e) => {
    setErrorKeyword(false);
    setTextKeyword(e.target.value);
  }, []);

  const onClickUser = useCallback(() => {
    try {
      const test = textUser.split('\n').filter((i) => i !== '');
      RegExp(test);
      dispatch(setUser(test));
      setShowResult(true);
    } catch (error) {
      console.error(error);
      setErrorUser(true);
    }
  }, [dispatch, textUser]);

  const onClickKeyword = useCallback(() => {
    try {
      const test = textKeyword.split('\n').filter((i) => i !== '');
      RegExp(test);
      dispatch(setKeyword(test));
      setShowResult(true);
    } catch (error) {
      console.error(error);
      setErrorKeyword(true);
    }
  }, [dispatch, textKeyword]);

  const handleClose = () => {
    setShowResult(false);
  };

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
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
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
          <ListItem divider button onClick={handleIncludeReply}>
            <ListItemText>댓글 뮤트 시 답글도 같이 뮤트</ListItemText>
            <ListItemSecondaryAction>
              <Switch
                checked={muteIncludeReply}
                onChange={handleIncludeReply}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>검사할 닉네임</ListItemText>
            <ListItemSecondaryAction>
              <IconButton onClick={onClickUser}>
                <Save />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <TextField
              variant="outlined"
              multiline
              fullWidth
              rows={6}
              value={textUser}
              onChange={handleUser}
              error={errorUser}
              helperText={
                errorUser && '정규식 조건을 위반하는 항목이 있습니다.'
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText>검사할 키워드</ListItemText>
            <ListItemSecondaryAction>
              <IconButton onClick={onClickKeyword}>
                <Save />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <TextField
              variant="outlined"
              multiline
              fullWidth
              rows={6}
              value={textKeyword}
              onChange={handleKeyword}
              error={errorKeyword}
              helperText={
                errorKeyword && '정규식 조건을 위반하는 항목이 있습니다.'
              }
            />
          </ListItem>
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
                NoRowsOverlay: () => (
                  <GridOverlay>뮤트된 아카콘이 없습니다.</GridOverlay>
                ),
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
                {Object.keys(nameMap).map((id, index) => (
                  <CategoryRow
                    key={id}
                    divider={index !== 0}
                    category={id}
                    nameMap={nameMap}
                  />
                ))}
              </Grid>
            </Paper>
          </ListItem>
        </List>
        <Snackbar
          open={showResult}
          autoHideDuration={3000}
          onClose={handleClose}
          message="저장했습니다."
          action={
            <IconButton onClick={handleClose}>
              <Close fontSize="small" />
            </IconButton>
          }
        />
      </Paper>
    </>
  );
}

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
