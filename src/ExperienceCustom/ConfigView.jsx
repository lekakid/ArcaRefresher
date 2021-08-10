import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ConfigGroup from '../$Config/ConfigGroup';
import {
  toggleArticleNewWindow,
  toggleMediaNewWindow,
  toggleRateDownGuard,
  toggleComment,
  toggleWideArea,
} from './slice';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 'md',
  },
}));

export default function ConfigView() {
  const dispatch = useDispatch();
  const {
    openArticleNewWindow,
    blockMediaNewWindow,
    ratedownGuard,
    foldComment,
    wideArea,
  } = useSelector((state) => state.ExperienceCustom);

  const handleArticleNewWindow = useCallback(() => {
    dispatch(toggleArticleNewWindow());
  }, [dispatch]);

  const handleMediaNewWindow = useCallback(() => {
    dispatch(toggleMediaNewWindow());
  }, [dispatch]);

  const handleRateDownGuard = useCallback(() => {
    dispatch(toggleRateDownGuard());
  }, [dispatch]);

  const handleComment = useCallback(() => {
    dispatch(toggleComment());
  }, [dispatch]);

  const handleWideArea = useCallback(() => {
    dispatch(toggleWideArea());
  }, [dispatch]);

  const classes = useStyles();
  return (
    <ConfigGroup name="사용자 경험 커스텀">
      <List className={classes.root}>
        <ListItem>
          <ListItemText>게시물 새 창에서 열기</ListItemText>
          <ListItemSecondaryAction>
            <Switch
              checked={openArticleNewWindow}
              onChange={handleArticleNewWindow}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>
            이미지, 동영상 새 창 열기 방지(새로고침 필요)
          </ListItemText>
          <ListItemSecondaryAction>
            <Switch
              checked={blockMediaNewWindow}
              onChange={handleMediaNewWindow}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>비추천 방지</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={ratedownGuard} onChange={handleRateDownGuard} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>댓글 접기</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={foldComment} onChange={handleComment} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>댓글란 어디든 클릭 시 답글</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={wideArea} onChange={handleWideArea} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </ConfigGroup>
  );
}
