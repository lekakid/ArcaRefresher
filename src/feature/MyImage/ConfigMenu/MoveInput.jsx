import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  Select,
} from '@material-ui/core';
import React, { useCallback, useState } from 'react';

export default function MoveInput({ open, channelList, onClose, onSubmit }) {
  const [input, setInput] = useState('_shared_');

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(input);
  }, [input, onSubmit]);

  return (
    <Dialog open={open}>
      <DialogTitle>이동할 채널 선택</DialogTitle>
      <DialogContent>
        <Select value={input} onChange={handleChange}>
          {channelList.map((key) => (
            <ListItem key={key} value={key}>
              {key}
            </ListItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>확인</Button>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
}
