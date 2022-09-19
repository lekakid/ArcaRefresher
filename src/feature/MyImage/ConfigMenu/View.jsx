import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Select,
  Switch,
  Typography,
  Divider,
  Grid,
  ListItemSecondaryAction,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Delete, SelectAll, SyncAlt } from '@material-ui/icons';

import { useParser } from 'util/Parser';
import Info from '../FeatureInfo';
import { setImageList, toggleEnabled, toggleForceLoad } from '../slice';
import ImageSelector from './ImageSelector';
import MoveInput from './MoveInput';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  channelSelect: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { channel } = useParser();
  const { enabled, imgList, forceLoad } = useSelector(
    (state) => state[Info.ID],
  );
  const [selectedChannel, setSelectedChannel] = useState(
    channel.ID || '_shared_',
  );
  const [selection, setSelection] = useState([]);
  const [open, setOpen] = useState(false);
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

  const handleSelect = useCallback((update) => {
    setSelection(update);
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

  const handleMoveClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleMove = useCallback(
    (targetChannel) => {
      const targetList = imgList[targetChannel];
      const rest = imgList[selectedChannel].filter(
        (_img, index) => !selection.includes(index),
      );
      const move = imgList[selectedChannel].filter((img, index) =>
        selection.includes(index),
      );
      const update = [...targetList, ...move];
      dispatch(setImageList({ channel: selectedChannel, list: rest }));
      dispatch(setImageList({ channel: targetChannel, list: update }));
      setOpen(false);
    },
    [dispatch, imgList, selectedChannel, selection],
  );

  const handleDelete = useCallback(() => {
    const update = imgList[selectedChannel].filter(
      (_img, index) => !selection.includes(index),
    );
    dispatch(setImageList({ channel: selectedChannel, list: update }));
    setSelection([]);
  }, [dispatch, imgList, selectedChannel, selection]);

  const channelList = [...Object.keys(imgList), channel.ID].filter(
    (c, index, arr) => c !== null && arr.indexOf(c) === index,
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
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
                    {channelList.map((key) => (
                      <ListItem key={key} value={key}>
                        {key === '_shared_' ? '공유 자짤' : key}
                      </ListItem>
                    ))}
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
              <ImageSelector
                list={imgList[selectedChannel]}
                selection={selection}
                onChange={handleSelect}
              />
            </Paper>
          </ListItem>
        </List>
      </Paper>
      <MoveInput
        open={open}
        channelList={channelList}
        onClose={handleMoveClose}
        onSubmit={handleMove}
      />
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
