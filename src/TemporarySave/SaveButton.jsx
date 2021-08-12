import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Snackbar } from '@material-ui/core';
import { Add, Save } from '@material-ui/icons';

import { MODULE_ID } from './ModuleInfo';
import { saveArticle, saveAsArticle } from './slice';

export default function SaveButton({ saveAs = false }) {
  const dispatch = useDispatch();
  const { titleInput, editor } = useSelector((state) => state[MODULE_ID]);
  const [snack, setSnack] = useState(false);

  const handleClick = useCallback(() => {
    if (!titleInput || !editor) return;

    const date = new Date();
    const timestamp = date.getTime();
    const title = titleInput.value || `${date.toLocaleString()}에 저장됨`;
    const content = editor.html.get(true);

    if (saveAs) dispatch(saveAsArticle({ timestamp, title, content }));
    else dispatch(saveArticle({ timestamp, title, content }));
    setSnack(true);
  }, [dispatch, editor, titleInput, saveAs]);

  const handleSnackClose = useCallback(() => {
    setSnack(false);
  }, []);

  const icon = !saveAs ? <Save /> : <Add />;
  const text = !saveAs ? '저장' : '새로 저장';

  return (
    <>
      <Button startIcon={icon} onClick={handleClick}>
        {text}
      </Button>
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message="저장되었습니다."
      />
    </>
  );
}
