import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import React from 'react';

export default function RemoveConfirm({ open, target, onSubmit, onClose }) {
  return (
    <Dialog open={open}>
      <DialogTitle>프리셋 제거</DialogTitle>
      <DialogContent>{`'${target}' 프리셋을 제거하시겠습니까?`}</DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>예</Button>
        <Button onClick={onClose}>아니오</Button>
      </DialogActions>
    </Dialog>
  );
}
