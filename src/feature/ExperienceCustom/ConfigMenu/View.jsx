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
  TextField,
  Typography,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import {
  $setSpoofTitle,
  $toggleArticleNewWindow,
  $toggleBlockMediaNewWindow,
  $toggleRateDownGuard,
  $toggleComment,
  $toggleWideArea,
  $toggleIgnoreExternalLinkWarning,
  $toggleEnhancedArticleManage,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const {
    spoofTitle,
    openArticleNewWindow,
    blockMediaNewWindow,
    ignoreExternalLinkWarning,
    ratedownGuard,
    foldComment,
    wideClickArea,
    enhancedArticleManage,
  } = useSelector((state) => state[Info.ID].storage);

  const handleSpoofTitle = useCallback(
    (e) => {
      dispatch($setSpoofTitle(e.target.value));
    },
    [dispatch],
  );

  const handleArticleNewWindow = useCallback(() => {
    dispatch($toggleArticleNewWindow());
  }, [dispatch]);

  const handleMediaNewWindow = useCallback(() => {
    dispatch($toggleBlockMediaNewWindow());
  }, [dispatch]);

  const handleExternalLinkWarning = useCallback(() => {
    dispatch($toggleIgnoreExternalLinkWarning());
  }, [dispatch]);

  const handleRateDownGuard = useCallback(() => {
    dispatch($toggleRateDownGuard());
  }, [dispatch]);

  const handleComment = useCallback(() => {
    dispatch($toggleComment());
  }, [dispatch]);

  const handleWideArea = useCallback(() => {
    dispatch($toggleWideArea());
  }, [dispatch]);

  const handleEnhancedArticleManage = useCallback(() => {
    dispatch($toggleEnhancedArticleManage());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary="사이트 표시 제목 변경"
              secondary="공란일 시 변경하지 않습니다."
            />
          </ListItem>
          <ListItem divider>
            <TextField
              fullWidth
              value={spoofTitle}
              onChange={handleSpoofTitle}
            />
          </ListItem>
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
          <ListItem divider button onClick={handleExternalLinkWarning}>
            <ListItemText
              primary="외부 링크 오픈 시 경고 무시"
              secondary="새로고침 후에 적용됩니다."
            />
            <ListItemSecondaryAction>
              <Switch
                checked={ignoreExternalLinkWarning}
                onChange={handleExternalLinkWarning}
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
          <ListItem divider button onClick={handleWideArea}>
            <ListItemText
              primary="넓은 답글 버튼 사용"
              secondary="댓글 어디를 클릭하든 답글창이 열립니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={wideClickArea} onChange={handleWideArea} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleEnhancedArticleManage}>
            <ListItemText
              primary="개선된 게시물 관리 사용"
              secondary="체크박스의 클릭 범위를 여유롭게 만들고 드래그로 한번에 선택할 수 있습니다."
            />
            <ListItemSecondaryAction>
              <Switch
                checked={enhancedArticleManage}
                onChange={handleEnhancedArticleManage}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
