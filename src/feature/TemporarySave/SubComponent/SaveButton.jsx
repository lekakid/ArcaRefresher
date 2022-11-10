import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Snackbar } from '@material-ui/core';
import { Add, Save } from '@material-ui/icons';

import { $saveArticle, setCurrentSlot } from '../slice';
import Info from '../FeatureInfo';

export default function SaveButton({ editor, saveAs = false, ...btnProps }) {
  const dispatch = useDispatch();
  const { currentSlot } = useSelector((state) => state[Info.ID]);
  const [snack, setSnack] = useState(false);

  const handleClick = useCallback(() => {
    if (!editor) return;

    const date = new Date();
    const timestamp = date.getTime();
    const title = editor.title.value || `${date.toLocaleString()}에 저장됨`;
    const content = editor.content.html.get(true);

    const slot = saveAs ? timestamp : currentSlot || timestamp;
    if (!currentSlot) dispatch(setCurrentSlot(slot));
    dispatch($saveArticle({ slot, title, content }));
    setSnack(true);
  }, [currentSlot, dispatch, editor, saveAs]);

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
