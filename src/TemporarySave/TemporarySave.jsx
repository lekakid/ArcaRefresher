import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import useElementQuery from '../$Common/useElementQuery';
import { WRITE_LOADED } from '../$Common/Selector';

import { setEditor } from './slice';
import { AutoSaver, SaveButton, LoadButton } from './feature';

const useStyles = makeStyles({
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
  const dispatch = useDispatch();
  const editorLoaded = useElementQuery(WRITE_LOADED);
  const [container, setContainer] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (!editorLoaded) return;

    const title = document.querySelector('#inputTitle');
    const editor = unsafeWindow.FroalaEditor('#content');
    dispatch(setEditor({ title, editor }));

    const tempButton = document.createElement('div');
    tempButton.classList.add('tmpBtn');
    const btns = document.querySelector('.article-write .btns');
    btns.classList.add(classes.root);
    btns.append(tempButton);
    setContainer(tempButton);
  }, [classes, dispatch, editorLoaded]);

  if (!container) return null;
  return ReactDOM.createPortal(
    <ButtonGroup variant="outlined">
      <AutoSaver />
      <SaveButton saveAs />
      <SaveButton />
      <LoadButton />
    </ButtonGroup>,
    container,
  );
}
