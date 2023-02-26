import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from '@material-ui/core';
import { Add, Done } from '@material-ui/icons';

import { useContent } from 'util/ContentInfo';

import Info from '../FeatureInfo';
import { $addFolder, $addImage, $removeImage } from '../slice';

function FolderCheckList({ open, url, onClose }) {
  const dispatch = useDispatch();
  const { channel } = useContent();
  const { imgList } = useSelector((state) => state[Info.ID].storage);
  const [openInput, setOpenInput] = useState(false);
  const [input, setInput] = useState('');

  const handleSelectFolder = useCallback(
    (e) => {
      const action = e.target.checked ? $addImage : $removeImage;
      dispatch(action({ folder: e.target.name, url }));
    },
    [dispatch, url],
  );

  const handleInput = useCallback((e) => {
    const regex = /^[0-9a-zA-Zㄱ-힣]*$/;
    if (!regex.test(e.target.value)) return;
    setInput(e.target.value);
  }, []);

  const createFolder = useCallback(() => {
    dispatch($addFolder(input));
    dispatch($addImage({ folder: input, url }));
    setOpenInput(false);
  }, [dispatch, input, url]);

  const handleFocus = useCallback((e) => {
    e.target.select();
  }, []);

  const handleEnter = useCallback(
    (e) => {
      if (e?.key !== 'Enter') return;

      createFolder();
    },
    [createFolder],
  );

  const folderList = Object.entries(imgList);
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>자짤 추가/제거</DialogTitle>
      <DialogContent>
        <FormGroup>
          {folderList.map(([folder, list]) => (
            <FormControlLabel
              key={folder}
              control={
                <Checkbox
                  size="small"
                  name={folder}
                  checked={list.includes(url)}
                  onChange={handleSelectFolder}
                />
              }
              label={folder === '_shared_' ? '공용 폴더' : folder}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        {openInput && (
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                autoFocus
                value={input}
                error={folderList.some(([folder]) => input === folder)}
                onChange={handleInput}
                onFocus={handleFocus}
                onKeyUp={handleEnter}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                startIcon={<Done />}
                disabled={
                  folderList.some(([folder]) => input === folder) ||
                  input === ''
                }
                onClick={createFolder}
              >
                완료
              </Button>
            </Grid>
          </Grid>
        )}
        {!openInput && (
          <Button
            fullWidth
            startIcon={<Add />}
            onClick={() => {
              setInput(channel.ID);
              setOpenInput(true);
            }}
          >
            새 폴더 만들기
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default FolderCheckList;
