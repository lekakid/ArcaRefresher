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
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

import { useContent } from 'core/ContentCollector';

import { $addFolder, $addImage, $removeImage } from '../slice';
import info from '../info';

function FolderCheckList({ open, url, onClose }) {
  const dispatch = useDispatch();
  const { channel, article } = useContent();
  const { imgList } = useSelector((state) => state[info.id].storage);
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

  const cancelCreate = useCallback(() => {
    setFolderInput('');
    setOpenFolderInput(false);
  }, []);

  const handleFocus = useCallback((e) => {
    e.target.select();
  }, []);

  const handleFolderEnter = useCallback(
    (e) => {
      if (e?.key !== 'Enter') return;
      if (folderInput === '') return;
      if (Object.hasOwn(imgList, folderInput)) return;

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
        <Grid container sx={{ width: '100%' }}>
          {openFolderInput && (
            <>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  autoFocus
                  value={folderInput}
                  error={
                    Object.hasOwn(imgList, folderInput) || folderInput === ''
                  }
                  onChange={handleFolderInput}
                  onFocus={handleFocus}
                  onKeyUp={handleFolderEnter}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                {folderInput.length > 0 ? (
                  <Button
                    fullWidth
                    startIcon={<AddIcon />}
                    disabled={Object.hasOwn(imgList, folderInput)}
                    onClick={createFolder}
                  >
                    폴더 추가
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    startIcon={<CloseIcon />}
                    onClick={cancelCreate}
                  >
                    취소
                  </Button>
                )}
              </Grid>
            </>
          )}
          {!openFolderInput && (
            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                startIcon={<ExpandMoreIcon />}
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
