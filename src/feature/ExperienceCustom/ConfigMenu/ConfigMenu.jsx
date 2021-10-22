import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import {
  toggleArticleNewWindow,
  toggleMediaNewWindow,
  toggleRateDownGuard,
  toggleComment,
  toggleWideArea,
} from '../slice';

function ConfigMenu() {
  const dispatch = useDispatch();
  const {
    openArticleNewWindow,
    blockMediaNewWindow,
    ratedownGuard,
    foldComment,
    wideClickArea,
  } = useSelector((state) => state[MODULE_ID]);

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

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
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
              secondary="게시물에서 이미지, 동영상 클릭을 막습니다. (새로고침 필요)"
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
              secondary="게시물 댓글을 접습니다. 접어놓은 댓글 보기 버튼이 추가됩니다."
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
    </>
  );
}

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
