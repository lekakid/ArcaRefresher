import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Divider,
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import {
  BrokenImage,
  Close,
  Image,
  Remove,
  Save,
  VolumeOff,
  VolumeUp,
} from '@material-ui/icons';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import {
  removeEmoticonList,
  setCategoryConfig,
  setKeyword,
  setUser,
  toggleCountBar,
  toggleIncludeReply,
} from './slice';
import useElementQuery from '../$Common/useElementQuery';
import { BOARD_LOADED } from '../$Common/Selector';
import { getCategory } from '../$Common/Parser';

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

export default function ConfigView() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    hideCountBar,
    muteIncludeReply,
    user,
    keyword,
    emoticon,
    channelID,
    category,
  } = useSelector((state) => state[MODULE_ID]);
  const tableRows = Object.keys(emoticon).map((key) => ({
    id: key,
    name: emoticon[key].name,
    bundle: emoticon[key].bundle,
    url: emoticon[key].url,
  }));
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [textUser, setTextUser] = useState(user.join('\n'));
  const [textKeyword, setTextKeyword] = useState(keyword.join('\n'));
  const [errorUser, setErrorUser] = useState(false);
  const [errorKeyword, setErrorKeyword] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selection, setSelection] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [categoryMap, setCategoryMap] = useState({});

  const channelCategoryConfig = category[channelID] || {};

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    setCategoryMap(getCategory());
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

  const handleCategory = useCallback(
    (categoryID, type) => () => {
      const newConfig = {
        ...channelCategoryConfig[categoryID],
        [type]: !(channelCategoryConfig[categoryID] || {})[type],
      };
      dispatch(
        setCategoryConfig({
          channel: channelID,
          category: categoryID,
          config: newConfig,
        }),
      );
    },
    [channelCategoryConfig, channelID, dispatch],
  );

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem divider>
            <ListItemText
              primary="뮤트 카운터 숨김"
              secondary="뮤트된 게시물이 몇개인지 표시되는 바를 제거합니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={hideCountBar} onChange={handleCountBar} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
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
                {Object.keys(categoryMap).map((id, index) => {
                  const { mutePreview, muteArticle } =
                    channelCategoryConfig[id] || {};

                  return (
                    <>
                      {index !== 0 && (
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                      )}
                      <Grid item sm={6} xs={12}>
                        <Box
                          display="flex"
                          height="100%"
                          minHeight="48px"
                          width="100%"
                          alignItems="center"
                        >
                          <span
                            className="badge badge-success"
                            style={{ margin: '0.25rem' }}
                          >
                            {categoryMap[id]}
                          </span>
                        </Box>
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Box
                          display="flex"
                          justifyContent={mobile ? null : 'flex-end'}
                        >
                          <Tooltip title="미리보기 뮤트">
                            <IconButton
                              onClick={handleCategory(id, 'mutePreview')}
                            >
                              {mutePreview ? <BrokenImage /> : <Image />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="게시물 뮤트">
                            <IconButton
                              onClick={handleCategory(id, 'muteArticle')}
                            >
                              {muteArticle ? <VolumeOff /> : <VolumeUp />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </>
                  );
                })}
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
