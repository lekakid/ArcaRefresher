import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Snackbar } from '@material-ui/core';
import { Add, Save } from '@material-ui/icons';

import { saveArticle, saveAsArticle } from '../slice';

export default function SaveButton({ editor, saveAs = false, ...btnProps }) {
  const dispatch = useDispatch();
  const [snack, setSnack] = useState(false);

  const handleClick = useCallback(() => {
    if (!editor) return;

    const date = new Date();
    const timestamp = date.getTime();
    const title = editor.title.value || `${date.toLocaleString()}에 저장됨`;
    const content = editor.content.html.get(true);

    const action = saveAs ? saveAsArticle : saveArticle;
    dispatch(action({ timestamp, title, content }));
    setSnack(true);
  }, [dispatch, editor, saveAs]);

  const handleSnackClose = useCallback(() => {
    setSnack(false);
  }, []);

  const icon = !saveAs ? <Save /> : <Add />;
  const text = !saveAs ? '저장' : '새로 저장';

  return (
    <>
      {React.cloneElement(
        <Button startIcon={icon} onClick={handleClick}>
          {text}
        </Button>,
        btnProps,
      )}
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message="저장되었습니다."
      />
    </>
  );
}
