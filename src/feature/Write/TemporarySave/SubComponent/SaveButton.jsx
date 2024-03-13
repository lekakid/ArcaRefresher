import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Snackbar } from '@mui/material';
import { Add, Save } from '@mui/icons-material';

import { $addArticle, setCurrentSlot } from '../slice';
import Info from '../FeatureInfo';

function SaveButton({ editor, saveAs = false, ...btnPropsFromGroup }) {
  const dispatch = useDispatch();
  const { currentSlot } = useSelector((state) => state[Info.id]);
  const [snack, setSnack] = useState(false);

  const handleClick = useCallback(() => {
    if (!editor) return;

    const date = new Date();
    const timestamp = date.getTime();
    const title = editor.title.value || `${date.toLocaleString()}에 저장됨`;
    const content = editor.content.html.get(true);

    const slot = saveAs ? timestamp : currentSlot || timestamp;
    if (!currentSlot) dispatch(setCurrentSlot(slot));
    dispatch($addArticle({ slot, title, content }));
    setSnack(true);
  }, [currentSlot, dispatch, editor, saveAs]);

  const handleSnackClose = useCallback(() => {
    setSnack(false);
  }, []);

  const startIcon = !saveAs ? <Save /> : <Add />;
  const text = !saveAs ? '저장' : '사본으로 저장';
  const btnProps = {
    ...btnPropsFromGroup,
    startIcon,
    disabled: saveAs && !currentSlot,
    onClick: handleClick,
    children: text,
  };

  return (
    <>
      {React.cloneElement(<Button />, btnProps)}
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message="저장되었습니다."
      />
    </>
  );
}

SaveButton.propTypes = {
  editor: PropTypes.object.isRequired,
  saveAs: PropTypes.bool,
};

export default SaveButton;
