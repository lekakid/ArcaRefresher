import { unsafeWindow } from '$';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  GlobalStyles,
  Portal,
  Stack,
  useMediaQuery,
} from '@mui/material';

import { WRITE_LOADED } from 'constants/selector';
import { useLoadChecker } from 'core/LoadChecker';

import { AutoSaver, SaveButton, LoadButton } from './SubComponent';
import info from './info';
import { $removeArticle } from './slice';

const COMMIT_KEY = 'AR_TemporarySave_commit';

const btnsStyles = (
  <GlobalStyles
    styles={{
      '.article-write .btns': {
        display: 'none',
      },
    }}
  />
);

export default function TemporarySave() {
  const dispatch = useDispatch();
  const editorLoaded = useLoadChecker(WRITE_LOADED);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { enabled, deleteOnCommit } = useSelector(
    (state) => state[info.id].storage,
  );
  const { currentSlot } = useSelector((state) => state[info.id]);
  const [tempArticleContainer, setTemparticleContainer] = useState(null);
  const [submitHandlerContainer, setSubmitHandlerContainer] = useState(null);
  const [editor, setEditor] = useState(null);

  // 렌더 컨테이너 생성
  useEffect(() => {
    if (!enabled) return undefined;
    if (!editorLoaded) return undefined;

    const title = document.querySelector('#inputTitle');
    const content = unsafeWindow.editorInstance;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditor({ title, content });

    const btns = document.querySelector('.article-write .btns');
    const previewCb = document.querySelector('#hidden-preview-checkbox');

    const taContainer = document.createElement('div');
    previewCb.before(taContainer);
    setTemparticleContainer(taContainer);

    const shContainer = document.createElement('div');
    btns.after(shContainer);
    setSubmitHandlerContainer(shContainer);

    return () => {
      taContainer.remove();
      shContainer.remove();

      setTemparticleContainer(null);
      setSubmitHandlerContainer(null);
    };
  }, [enabled, editorLoaded]);

  useEffect(() => {
    const slot = sessionStorage.getItem(COMMIT_KEY);
    if (!slot) return;
    sessionStorage.removeItem(COMMIT_KEY);

    const from = document.referrer ? new URL(document.referrer).pathname : '';
    const posted =
      /\/(write|edit)$/.test(from) &&
      /^\/b\/[^/]+\/\d+/.test(window.location.pathname);
    if (posted) dispatch($removeArticle({ slot }));
  }, [dispatch]);

  useEffect(() => {
    const resume = () => sessionStorage.removeItem(COMMIT_KEY);
    document.addEventListener('input', resume);
    return () => document.removeEventListener('input', resume);
  }, []);

  const handleCommit = useCallback(() => {
    if (deleteOnCommit && currentSlot) {
      sessionStorage.setItem(COMMIT_KEY, currentSlot);
    } else {
      sessionStorage.removeItem(COMMIT_KEY);
    }

    const submitBtn = document.querySelector('#submitBtn');
    submitBtn.click();
  }, [currentSlot, deleteOnCommit]);

  const handleBack = () => {
    sessionStorage.removeItem(COMMIT_KEY);
    const backBtn = document.querySelector(
      '.article-write .btns a:first-child',
    );

    backBtn.click();
  };

  useEffect(() => {
    if (!editor) return undefined;

    const handler = (e) => {
      if (e.key !== 'Enter' || e.isComposing) return;

      e.preventDefault();
      handleCommit();
    };
    editor.title.addEventListener('keydown', handler);
    return () => editor.title.removeEventListener('keydown', handler);
  }, [editor, handleCommit]);

  if (!enabled) return null;
  if (!tempArticleContainer) return null;
  if (!submitHandlerContainer) return null;

  return (
    <>
      {btnsStyles}
      <AutoSaver editor={editor} />
      <Portal container={tempArticleContainer}>
        <ButtonGroup sx={{ pb: 2, width: mobile ? '100%' : undefined }}>
          <SaveButton sx={{ flexGrow: 1 }} editor={editor} />
          <SaveButton sx={{ flexGrow: 2 }} editor={editor} saveAs />
          <LoadButton sx={{ flexGrow: 1 }} editor={editor} />
        </ButtonGroup>
      </Portal>
      <Portal container={submitHandlerContainer}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Button onClick={handleBack}>돌아가기</Button>
          <Button onClick={handleCommit}>작성</Button>
        </Stack>
      </Portal>
    </>
  );
}
