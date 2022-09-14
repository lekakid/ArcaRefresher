import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import { WRITE_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { useParser } from 'util/Parser';

import Info from './FeatureInfo';

const SHARED = '_shared_';

export default function MyImage() {
  const dispatch = useDispatch();
  const editorLoaded = useElementQuery(WRITE_LOADED);
  const { channelID } = useParser();
  const { enabled, imgList, forceLoad } = useSelector(
    (state) => state[Info.ID],
  );
  const [open, setOpen] = useState(false);
  const [editor, setEditor] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const sharedImgList = imgList[SHARED] || [];
  const channelImgList = imgList[channelID] || [];
  const targetImgList = [...channelImgList, ...sharedImgList];

  useEffect(() => {
    if (!enabled) return;
    if (!editorLoaded) return;
    if (/edit$/.test(window.location.pathname)) return;
    setEditor(unsafeWindow.FroalaEditor('#content'));
  }, [dispatch, editorLoaded, enabled]);

  const handleLoad = useCallback(() => {
    const img = targetImgList[Math.floor(Math.random() * targetImgList.length)];
    if (!img) return;

    const html =
      img.indexOf('.mp4') > -1
        ? `<video src="${img}" autoPlay loop muted playsinline data-orig="gif">`
        : `<img src="${img}">`;
    editor.html.set(html);
    editor.html.insert('<p></p>');
    editor.selection.setAtEnd(editor.$el.get(0));
    setLoaded(true);
    setOpen(false);
  }, [targetImgList, editor]);

  useEffect(() => {
    if (loaded) return;
    if (!editor) return;
    if (targetImgList.length === 0) return;

    if (forceLoad || !editor.html.get(true)) {
      handleLoad();
    } else {
      setOpen(true);
    }
  }, [editor, forceLoad, handleLoad, loaded, targetImgList]);

  const handleClose = useCallback(() => {
    setLoaded(true);
    setOpen(false);
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle>자동 자짤 사용 여부</DialogTitle>
      <DialogContent>이전에 작성하던 글 내역이 있습니다.</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>이전 글 사용</Button>
        <Button onClick={handleLoad}>덮어쓰기</Button>
      </DialogActions>
    </Dialog>
  );
}
