import React, { useEffect, useState } from 'react';
import { ButtonGroup, GlobalStyles, Portal } from '@mui/material';

import { WRITE_LOADED } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { AutoSaver, SaveButton, LoadButton } from './SubComponent';

const btnsStyles = (
  <GlobalStyles
    styles={{
      '.article-write .btns': {
        display: 'grid',
        gridTemplateColumns: '1fr 7rem',
        gridTemplateAreas: `
          'tmp save'
          'recapcha recapcha'
        `,
        rowGap: '1rem',
        '& > .tmpBtn': {
          gridArea: 'tmp',
          textAlign: 'left',
        },
        '& > #submitBtn': {
          gridArea: 'save',
        },
        '& > div': {
          gridArea: 'recapcha',
        },
      },
    }}
  />
);

export default function TemporarySave() {
  const editorLoaded = useLoadChecker(WRITE_LOADED);
  const [container, setContainer] = useState(null);
  const [editor, setEditor] = useState(null);

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

  if (!container) return null;
  return (
    <>
      {btnsStyles}
      <AutoSaver editor={editor} />
      <Portal container={container}>
        <ButtonGroup>
          <SaveButton editor={editor} />
          <SaveButton editor={editor} saveAs />
          <LoadButton editor={editor} />
        </ButtonGroup>
      </Portal>
    </>
  );
}
