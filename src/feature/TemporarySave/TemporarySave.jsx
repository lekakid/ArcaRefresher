import React, { useEffect, useState } from 'react';
import { ButtonGroup, Portal } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useContent } from 'util/ContentInfo';

import { AutoSaver, SaveButton, LoadButton } from './feature';

const useStyles = makeStyles({
  '@global': {
    '.copyHumor': {
      float: 'none !important',
    },
  },
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 7rem',
    gridTemplateAreas: `'tmp save'
      'recapcha recapcha'`,
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
});

export default function TemporarySave() {
  const {
    load: { write: editorLoaded },
  } = useContent();
  const [container, setContainer] = useState(null);
  const [editor, setEditor] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (!editorLoaded) return;

    const title = document.querySelector('#inputTitle');
    const content = unsafeWindow.FroalaEditor('#content');
    setEditor({ title, content });

    const tempButton = document.createElement('div');
    tempButton.classList.add('tmpBtn');
    const btns = document.querySelector('.article-write .btns');
    btns.classList.add(classes.root);
    btns.append(tempButton);
    setContainer(tempButton);
  }, [classes, editorLoaded]);

  if (!container) return null;
  return (
    <Portal container={container}>
      <ButtonGroup variant="outlined">
        <AutoSaver editor={editor} />
        <SaveButton editor={editor} saveAs />
        <SaveButton editor={editor} />
        <LoadButton editor={editor} />
      </ButtonGroup>
    </Portal>
  );
}
