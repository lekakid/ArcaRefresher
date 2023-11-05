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
import { Add, ExpandMore } from '@material-ui/icons';

import { useContent } from 'hooks/Content';

import Info from '../FeatureInfo';
import { $addFolder, $addImage, $removeImage } from '../slice';

function FolderCheckList({ open, url, onClose }) {
  const dispatch = useDispatch();
  const { channel, article } = useContent();
  const { imgList } = useSelector((state) => state[Info.ID].storage);
  const [openFolderInput, setOpenFolderInput] = useState(false);
  const [folderInput, setFolderInput] = useState('');

  const handleSelectFolder = useCallback(
    (e) => {
      const action = e.target.checked ? $addImage : $removeImage;
      dispatch(
        action({ folder: e.target.name, image: { url, memo: article.url } }),
      );
    },
    [article, dispatch, url],
  );

  const handleFolderInput = useCallback((e) => {
    const regex = /^[0-9a-zA-Zㄱ-힣]*$/;
    if (!regex.test(e.target.value)) return;
    setFolderInput(e.target.value);
  }, []);

  const createFolder = useCallback(() => {
    dispatch($addFolder(folderInput));
    setOpenFolderInput(false);
  }, [dispatch, folderInput]);

  const handleFocus = useCallback((e) => {
    e.target.select();
  }, []);

  const handleFolderEnter = useCallback(
    (e) => {
      if (e?.key !== 'Enter') return;
      if (folderInput === '') return;
      if (Object.keys(imgList).includes(folderInput)) return;

      createFolder();
    },
    [createFolder, folderInput, imgList],
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
                  checked={list.some((i) => i.url === url)}
                  onChange={handleSelectFolder}
                />
              }
              label={folder === '_shared_' ? '공용 폴더' : folder}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Grid container>
          {openFolderInput && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  autoFocus
                  value={folderInput}
                  error={folderList.includes(folderInput) || folderInput === ''}
                  onChange={handleFolderInput}
                  onFocus={handleFocus}
                  onKeyUp={handleFolderEnter}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  startIcon={<Add />}
                  disabled={
                    folderList.includes(folderInput) || folderInput === ''
                  }
                  onClick={createFolder}
                >
                  폴더 추가
                </Button>
              </Grid>
            </>
          )}
          {!openFolderInput && (
            <Grid item xs={12}>
              <Button
                fullWidth
                startIcon={<ExpandMore />}
                onClick={() => {
                  setFolderInput(channel.ID);
                  setOpenFolderInput(true);
                }}
              >
                새 폴더 만들기
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

export default FolderCheckList;
