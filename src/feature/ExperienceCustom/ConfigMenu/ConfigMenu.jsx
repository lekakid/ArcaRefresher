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

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import {
  toggleArticleNewWindow,
  toggleHideFirstImage,
  toggleBlockMediaNewWindow,
  toggleRateDownGuard,
  toggleComment,
  toggleWideArea,
  toggleBlockDeletedArticleMedia,
} from '../slice';

const ConfigMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ConfigMenu(_props, ref) {
    const dispatch = useDispatch();
    const {
      config: {
        openArticleNewWindow,
        hideFirstImage,
        blockMediaNewWindow,
        blockDeletedArticleMedia,
        ratedownGuard,
        foldComment,
        wideClickArea,
      },
    } = useSelector((state) => state[MODULE_ID]);

    const handleArticleNewWindow = useCallback(() => {
      dispatch(toggleArticleNewWindow());
    }, [dispatch]);

    const handleHideFirstImage = useCallback(() => {
      dispatch(toggleHideFirstImage());
    }, [dispatch]);

    const handleMediaNewWindow = useCallback(() => {
      dispatch(toggleBlockMediaNewWindow());
    }, [dispatch]);

    const handleBlockDeletedArticleMedia = useCallback(() => {
      dispatch(toggleBlockDeletedArticleMedia());
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
            <ListItem divider button onClick={handleHideFirstImage}>
              <ListItemText
                primary="게시물 첫 이미지 접기"
                secondary="첫 이미지(대문 제외)를 숨기고 다시 보일 수 있는 버튼을 제공합니다."
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={hideFirstImage}
                  onChange={handleHideFirstImage}
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
            <ListItem divider button onClick={handleBlockDeletedArticleMedia}>
              <ListItemText
                primary="삭제된 게시물의 미디어 컨텐츠 숨김"
                secondary="(채널 관리자 전용) 삭제된 게시물 조회 시 눈을 보호해줍니다."
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={blockDeletedArticleMedia}
                  onChange={handleBlockDeletedArticleMedia}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider button onClick={handleRateDownGuard}>
              <ListItemText
                primary="비추천 방지"
                secondary="비추천 버튼을 클릭하면 재확인 창이 표시됩니다."
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={ratedownGuard}
                  onChange={handleRateDownGuard}
                />
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
  },
);

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
