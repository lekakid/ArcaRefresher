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

import { WRITE_LOADED } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { AutoSaver, SaveButton, LoadButton } from './SubComponent';
import Info from './FeatureInfo';
import { $removeArticle } from './slice';

const btnsStyles = (
  <GlobalStyles
    styles={{
      '.article-write .btns': {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateAreas: `
          'tmp'
          'recapcha'
        `,
        rowGap: '1rem',
        '& > .tmpBtn': {
          gridArea: 'tmp',
          textAlign: 'left',
        },
        '& > #submitBtn': {
          display: 'none',
        },
        '& > div': {
          gridArea: 'recapcha',
        },
      },
    }}
  />
);

export default function TemporarySave() {
  const dispatch = useDispatch();
  const editorLoaded = useLoadChecker(WRITE_LOADED);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { deleteOnCommit } = useSelector((state) => state[Info.id].storage);
  const { currentSlot } = useSelector((state) => state[Info.id]);
  const [container, setContainer] = useState(null);
  const [editor, setEditor] = useState(null);

  // 렌더 컨테이너 생성
  useEffect(() => {
    if (!editorLoaded) return;

    const title = document.querySelector('#inputTitle');
    const content = unsafeWindow.FroalaEditor('#content');
    setEditor({ title, content });

    const tempButton = document.createElement('div');
    tempButton.classList.add('tmpBtn');
    const btns = document.querySelector('.article-write .btns');
    btns.append(tempButton);
    setContainer(tempButton);
  }, [editorLoaded]);

  const handleCommit = useCallback(() => {
    if (deleteOnCommit) {
      dispatch($removeArticle({ slot: currentSlot }));
    }

    const submitBtn = document.querySelector('#submitBtn');
    submitBtn.click();
  }, [currentSlot, deleteOnCommit, dispatch]);

  useEffect(() => {
    if (!editor) return undefined;
    const handler = (e) => {
      if (e.key !== 'Enter') return;

      if (deleteOnCommit) {
        e.preventDefault();
        dispatch($removeArticle({ slot: currentSlot }));
      }

      const submitBtn = document.querySelector('#submitBtn');
      submitBtn.click();
    };
    editor.title.addEventListener('keydown', handler);
    return () => editor.title.removeEventListener('keydown', handler);
  }, [currentSlot, deleteOnCommit, dispatch, editor]);

  if (!container) return null;
  return (
    <>
      {btnsStyles}
      <AutoSaver editor={editor} />
      <Portal container={container}>
        <Stack
          direction={mobile ? 'column' : 'row'}
          justifyContent="space-between"
          gap={1}
        >
          <ButtonGroup sx={mobile ? { width: '100%' } : undefined}>
            <SaveButton sx={{ flexGrow: 1 }} editor={editor} />
            <SaveButton sx={{ flexGrow: 2 }} editor={editor} saveAs />
            <LoadButton sx={{ flexGrow: 1 }} editor={editor} />
          </ButtonGroup>
          <Button fullWidth={mobile} onClick={handleCommit}>
            작성
          </Button>
        </Stack>
      </Portal>
    </>
  );
}
