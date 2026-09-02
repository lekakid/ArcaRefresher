import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { useContent } from 'hooks/Content';
import { useLoadChecker } from 'hooks/LoadChecker';
import { WRITE_LOADED } from 'core/selector';

import Info from './FeatureInfo';
import { $toggleFirstLoad } from './slice';

const SHARED = '_shared_';

export default function MyImage() {
  const dispatch = useDispatch();
  const editorLoaded = useLoadChecker(WRITE_LOADED);
  const { channel } = useContent();
  const { enabled, imgList, forceLoad, firstLoad } = useSelector(
    (state) => state[Info.id].storage,
  );
  const [alert, setAlert] = useState(false);
  const [editor, setEditor] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const targetImgList = useMemo(
    () => [...(imgList[SHARED] || []), ...(imgList[channel.id] || [])],
    [channel, imgList],
  );

  // 에디터 조회
  useEffect(() => {
    if (!enabled) return;
    if (!editorLoaded) return;
    if (/edit$/.test(window.location.pathname)) return;
    setEditor(unsafeWindow.editorInstance);
  }, [dispatch, editorLoaded, enabled]);

  const handleLoad = useCallback(() => {
    const img =
      targetImgList[Math.floor(Math.random() * targetImgList.length)].url;
    if (!img) return;

    const html =
      img.indexOf('.mp4') > -1
        ? `<video src="${img}" autoPlay loop muted playsinline data-orig="gif">`
        : `<img src="${img}">`;
    editor.html.set(html);
    editor.html.insert('<p></p>');
    editor.selection.setAtEnd(editor.$el.get(0));
    setLoaded(true);
    setAlert(false);
  }, [targetImgList, editor]);

  useEffect(() => {
    if (!editor) return;
    if (targetImgList.length === 0) return;

    if (forceLoad || !editor.html.get(true)) {
      handleLoad();
    } else {
      setAlert(true);
    }
  }, [editor, forceLoad, handleLoad, targetImgList]);

  const handleConfirmClose = () => {
    setLoaded(true);
    setAlert(false);
  };

  const handleTutorialClose = () => {
    dispatch($toggleFirstLoad());
  };

  return (
    <>
      <Dialog open={firstLoad && loaded}>
        <DialogTitle>자짤 처음 사용 안내</DialogTitle>
        <DialogContent>
          <Typography>
            지정하신 자짤이 에디터에서 제대로 표기되지 않을 수 있습니다. 무슨
            이미지인지 확인은 되지 않더라도 글 작성 후에는 정상적으로 표기되니
            참고바랍니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTutorialClose}>더 이상 보지 않기</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={alert}>
        <DialogTitle>자동 자짤 적용 여부</DialogTitle>
        <DialogContent>이전에 작성하던 글 내역이 있습니다.</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>이전 글 사용</Button>
          <Button onClick={handleLoad}>덮어쓰기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
