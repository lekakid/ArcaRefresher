import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import useElementQuery from '../$Common/useElementQuery';
import { WRITE_LOADED } from '../$Common/Selector';

import { setEditor } from './slice';
import SaveButton from './SaveButton';
import LoadButton from './LoadButton';
import AutoSaver from './AutoSaver';

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

export default function ButtonContainer() {
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

  if (!editorLoaded || !container) return null;
  return ReactDOM.createPortal(
    <>
      <AutoSaver />
      <SaveButton saveAs />
      <SaveButton />
      <LoadButton />
    </>,
    container,
  );
}
