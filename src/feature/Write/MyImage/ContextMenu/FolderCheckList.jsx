import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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
} from '@mui/material';
import { Add, ExpandMore } from '@mui/icons-material';

import { useContent } from 'hooks/Content';

import Info from '../FeatureInfo';
import { $addFolder, $addImage, $removeImage } from '../slice';

function FolderCheckList({ open, url, onClose }) {
  const dispatch = useDispatch();
  const { channel, article } = useContent();
  const { imgList } = useSelector((state) => state[Info.id].storage);
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
                  setFolderInput(channel.id);
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

FolderCheckList.propTypes = {
  open: PropTypes.bool,
  url: PropTypes.string,
  onClose: PropTypes.func,
};

export default FolderCheckList;
