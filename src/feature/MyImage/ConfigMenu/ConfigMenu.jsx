import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Select,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Grid,
  Box,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Delete, SelectAll, SyncAlt } from '@material-ui/icons';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { setImageList, toggleEnabled, toggleForceLoad } from '../slice';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  imgList: {
    minHeight: 200,
    maxHeight: 400,
  },
  channelSelect: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  itemBar: {
    background: 'none',
  },
  checkbox: {
    background: 'rgba(255, 255, 255, 0.5) !important',
  },
}));

export default function ConfigMenu() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enabled, channelID, imgList, forceLoad } = useSelector(
    (state) => state[MODULE_ID],
  );
  const [selectedChannel, setSelectedChannel] = useState(
    channelID || '_shared_',
  );
  const [selection, setSelection] = useState([]);
  const [open, setOpen] = useState(false);
  const [moveChannel, setMoveChannel] = useState('_shared_');
  const classes = useStyles();

  const handleEnabled = useCallback(() => {
    dispatch(toggleEnabled());
  }, [dispatch]);

  const handleForceLoad = useCallback(() => {
    dispatch(toggleForceLoad());
  }, [dispatch]);

  const handleChannel = useCallback((e) => {
    setSelectedChannel(e.target.value);
    setSelection([]);
  }, []);

  const handleCheckbox = useCallback((index) => {
    setSelection((prev) => {
      if (prev.some((i) => i === index)) return prev.filter((i) => i !== index);
      return [...prev, index];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (imgList[selectedChannel].length === selection.length) {
      setSelection([]);
    } else {
      setSelection([...Array(imgList[selectedChannel].length).keys()]);
    }
  }, [imgList, selectedChannel, selection]);

  const handleMoveOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleMoveChannel = useCallback((e) => {
    setMoveChannel(e.target.value);
  }, []);

  const handleMoveClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleMove = useCallback(() => {
    const moveChannelList = imgList[moveChannel];
    const rest = imgList[selectedChannel].filter(
      (img, index) => !selection.includes(index),
    );
    const move = imgList[selectedChannel].filter((img, index) =>
      selection.includes(index),
    );
    dispatch(setImageList({ channel: selectedChannel, list: rest }));
    dispatch(
      setImageList({
        channel: moveChannel,
        list: [...moveChannelList, ...move],
      }),
    );
    setOpen(false);
  }, [dispatch, imgList, moveChannel, selectedChannel, selection]);

  const handleDelete = useCallback(() => {
    const list = imgList[selectedChannel].filter(
      (img, index) => !selection.includes(index),
    );
    dispatch(setImageList({ channel: selectedChannel, list }));
    setSelection([]);
  }, [dispatch, imgList, selectedChannel, selection]);

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleEnabled}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch checked={enabled} onChange={handleEnabled} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleForceLoad}>
            <ListItemText
              primary="자짤 강제로 덮어쓰기"
              secondary="작성하던 글이 있으면 강제로 덮어씁니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={forceLoad} onChange={handleForceLoad} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="등록된 목록"
              secondary="등록된 이미지들은 글 작성 시 최상단에 자동으로 첨부됩니다."
            />
          </ListItem>
          <ListItem>
            <Paper variant="outlined" classes={{ root: classes.container }}>
              <Grid container>
                <Grid item xs={4}>
                  <Select
                    variant="outlined"
                    classes={{ root: classes.channelSelect }}
                    value={selectedChannel}
                    onChange={handleChannel}
                  >
                    {Object.keys(imgList).map((key) => (
                      <ListItem key={key} value={key}>
                        {key === '_shared_' ? '공유 자짤' : key}
                      </ListItem>
                    ))}
                    {!imgList[channelID] && (
                      <ListItem key={channelID} value={channelID}>
                        {channelID}
                      </ListItem>
                    )}
                  </Select>
                </Grid>
                <Grid item xs={8} style={{ textAlign: 'right' }}>
                  <Button startIcon={<SelectAll />} onClick={handleSelectAll}>
                    전체 선택
                  </Button>
                  <Button
                    startIcon={<SyncAlt />}
                    disabled={selection.length === 0}
                    onClick={handleMoveOpen}
                  >
                    이동
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    disabled={selection.length === 0}
                    onClick={handleDelete}
                  >
                    삭제
                  </Button>
                </Grid>
              </Grid>
              <Divider />
              {!imgList[selectedChannel]?.length && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  className={classes.imgList}
                >
                  <Typography>저장된 자짤이 없습니다.</Typography>
                </Box>
              )}
              {imgList[selectedChannel]?.length > 0 && (
                <ImageList
                  cols={mobile ? 3 : 5}
                  rowHeight={100}
                  className={classes.imgList}
                >
                  {imgList[selectedChannel].map((img, index) => (
                    <ImageListItem onClick={() => handleCheckbox(index)}>
                      {img?.indexOf('.mp4') > -1 ? (
                        <video
                          src={img}
                          alt={img}
                          autoPlay
                          loop
                          muted
                          playsinline
                        />
                      ) : (
                        <img src={img} alt={img} />
                      )}

                      <ImageListItemBar
                        className={classes.itemBar}
                        position="top"
                        actionPosition="left"
                        actionIcon={
                          <Checkbox
                            size="small"
                            className={classes.checkbox}
                            checked={selection.includes(index)}
                          />
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Paper>
          </ListItem>
        </List>
      </Paper>
      <Dialog open={open}>
        <DialogTitle>이동할 채널 선택</DialogTitle>
        <DialogContent>
          <Select value={moveChannel} onChange={handleMoveChannel}>
            {Object.keys(imgList).map((key) => (
              <ListItem value={key}>{key}</ListItem>
            ))}
            {!imgList[channelID] && (
              <ListItem value={channelID}>{channelID}</ListItem>
            )}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMoveClose}>취소</Button>
          <Button onClick={handleMove}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
