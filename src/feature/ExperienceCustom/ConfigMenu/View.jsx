import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import {
  toggleArticleNewWindow,
  toggleBlockMediaNewWindow,
  toggleRateDownGuard,
  toggleComment,
  toggleWideArea,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const {
    config: {
      openArticleNewWindow,
      blockMediaNewWindow,
      ratedownGuard,
      foldComment,
      wideClickArea,
    },
  } = useSelector((state) => state[Info.ID]);

  const handleArticleNewWindow = useCallback(() => {
    dispatch(toggleArticleNewWindow());
  }, [dispatch]);

  const handleMediaNewWindow = useCallback(() => {
    dispatch(toggleBlockMediaNewWindow());
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

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleArticleNewWindow}>
            <ListItemText
              primary="게시물 새 창에서 열기"
              secondary="게시판 화면에서 게시물을 클릭하면 새 창에서 열리게 합니다."
            />
            <ListItemSecondaryAction>
              <Switch
                checked={openArticleNewWindow}
                onChange={handleArticleNewWindow}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleMediaNewWindow}>
            <ListItemText
              primary="이미지, 동영상 새 창 열기 방지"
              secondary="새로고침 후에 적용됩니다."
            />
            <ListItemSecondaryAction>
              <Switch
                checked={blockMediaNewWindow}
                onChange={handleMediaNewWindow}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleRateDownGuard}>
            <ListItemText
              primary="비추천 방지"
              secondary="비추천 버튼을 클릭하면 재확인 창이 표시됩니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={ratedownGuard} onChange={handleRateDownGuard} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleComment}>
            <ListItemText
              primary="댓글 접기"
              secondary="게시물 댓글을 접고 댓글 보기 버튼을 추가합니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={foldComment} onChange={handleComment} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleWideArea}>
            <ListItemText
              primary="넓은 답글 버튼 사용"
              secondary="댓글 어디를 클릭하든 답글창이 열립니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={wideClickArea} onChange={handleWideArea} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
