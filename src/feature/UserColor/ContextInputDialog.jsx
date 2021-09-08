import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { ColorPicker, createColor } from 'material-ui-color';

import { useContextMenuData } from 'menu/ContextMenu';
import { MODULE_ID } from './ModuleInfo';
import { setColor, setOpenDialog } from './slice';

export default function ContextInputDialog() {
  const dispatch = useDispatch();
  const { id } = useContextMenuData(MODULE_ID);
  const { color, open } = useSelector((state) => state[MODULE_ID]);
  const [input, setInput] = useState(createColor(''));

  const handleColor = useCallback((colorInfo) => {
    const updatedInput =
      typeof colorInfo === 'string' ? createColor(colorInfo) : colorInfo;
    setInput(updatedInput);
  }, []);

  const handleSave = useCallback(() => {
    const cssColor = input.name !== 'none' ? input.css.backgroundColor : null;
    dispatch(setColor({ user: id, color: cssColor }));
    dispatch(setOpenDialog(false));
  }, [dispatch, id, input]);

  const handleClose = useCallback(() => {
    dispatch(setOpenDialog(false));
  }, [dispatch]);

  useEffect(() => {
    if (!open) return;

    setInput(createColor(color[id] || ''));
  }, [color, id, open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>색상 설정</DialogTitle>
      <DialogContent>
        <Typography>지정할 색상을 선택해주세요</Typography>
        <ColorPicker
          deferred
          disableAlpha
          value={input}
          onChange={handleColor}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={input.error} onClick={handleSave}>
          저장
        </Button>
        <Button onClick={handleClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
}
