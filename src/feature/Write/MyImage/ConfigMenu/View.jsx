import React, { Fragment, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Select,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Cancel,
  Delete,
  Done,
  FileCopy,
  FlipToFront,
} from '@mui/icons-material';

import { useContent } from 'hooks/Content';

import { SwitchRow } from 'component/config';
import Info from '../FeatureInfo';
import {
  $addFolder,
  $removeFolder,
  $setFolderData,
  $toggleEnabled,
  $toggleForceLoad,
} from '../slice';
import ImageSelector from './ImageSelector';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { channel } = useContent();
  const { enabled, imgList, forceLoad } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const [currentFolder, setCurrentFolder] = useState('_shared_');
  const [inputName, setInputName] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [removeFolderName, setRemoveFolderName] = useState('');
  const [moveInfo, setMoveInfo] = useState(undefined);
  const [selection, setSelection] = useState([]);

  const onSelectFolder = useCallback((e) => {
    setCurrentFolder(e.target.value);
    setSelection([]);
  }, []);

  const createFolder = useCallback(() => {
    dispatch($addFolder(inputName));
    setCurrentFolder(inputName);
    setInputName(undefined);
  }, [dispatch, inputName]);

  const removeFolder = useCallback(() => {
    setCurrentFolder('_shared_');
    dispatch($removeFolder(removeFolderName));
    setOpenDialog(false);
  }, [dispatch, removeFolderName]);

  const handleInputName = useCallback((e) => {
    const regex = /^[0-9a-zA-Zㄱ-힣]*$/;
    if (!regex.test(e.target.value)) return;
    setInputName(e.target.value);
  }, []);

  const handleInputFocus = useCallback((e) => {
    e.target.select();
  }, []);

  const handleInputEnter = useCallback(
    (e) => {
      if (e?.key !== 'Enter') return;

      createFolder();
    },
    [createFolder],
  );

  const setMoveMode = useCallback(() => {
    setMoveInfo({ folder: currentFolder, selection });
  }, [currentFolder, selection]);

  const cancelMoveMode = useCallback(() => {
    setMoveInfo(undefined);
  }, []);

  const handleCopy = useCallback(() => {
    const targetList = imgList[currentFolder];

    const move = imgList[moveInfo.folder]
      .filter((i) => moveInfo.selection.includes(i.url))
      .filter((i) => !targetList.some((j) => j.url === i.url));
    const update = [...targetList, ...move];
    dispatch($setFolderData({ folder: currentFolder, list: update }));

    setMoveInfo(undefined);
  }, [currentFolder, dispatch, imgList, moveInfo]);

  const handleMove = useCallback(() => {
    const targetList = imgList[currentFolder];

    const move = imgList[moveInfo.folder]
      .filter((i) => moveInfo.selection.includes(i.url))
      .filter((i) => !targetList.some((j) => j.url === i.url));
    const update = [...targetList, ...move];
    dispatch($setFolderData({ folder: currentFolder, list: update }));

    const rest = imgList[moveInfo.folder].filter(
      (i) => !moveInfo.selection.includes(i.url),
    );
    dispatch($setFolderData({ folder: moveInfo.folder, list: rest }));

    setMoveInfo(undefined);
  }, [imgList, currentFolder, moveInfo, dispatch]);

  const handleDelete = useCallback(() => {
    const update = imgList[currentFolder].filter(
      (img) => !selection.includes(img.url),
    );
    dispatch($setFolderData({ folder: currentFolder, list: update }));
    setSelection([]);
  }, [dispatch, imgList, currentFolder, selection]);

  const handleChange = useCallback(
    (update) => {
      dispatch($setFolderData({ folder: currentFolder, list: update }));
    },
    [dispatch, currentFolder],
  );

  const folderList = Object.keys(imgList).sort();
  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="사용"
            value={enabled}
            action={$toggleEnabled}
          />
          <SwitchRow
            divider
            primary="자짤 강제로 덮어쓰기"
            secondary="작성하던 글이 있으면 강제로 덮어씁니다."
            value={forceLoad}
            action={$toggleForceLoad}
          />
          <ListItem>
            <ListItemText
              primary="자짤 목록"
              secondary="채널 slug와 같은 이름을 가진 폴더는 글 작성 시 이미지가 자동으로 첨부됩니다."
            />
          </ListItem>
          <ListItem>
            <Paper variant="outlined" sx={{ width: '100%' }}>
              <Stack>
                <Stack direction="row">
                  {inputName === undefined && (
                    <>
                      <Select
                        sx={{ flexGrow: 1 }}
                        value={currentFolder}
                        onChange={onSelectFolder}
                      >
                        {folderList.map((key) => (
                          <MenuItem key={key} value={key}>
                            {key === '_shared_' ? '공용 폴더' : key}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="text"
                        startIcon={<Add />}
                        onClick={() => setInputName(channel.ID)}
                      >
                        추가
                      </Button>
                      <Button
                        variant="text"
                        startIcon={<Delete />}
                        disabled={!!moveInfo || currentFolder === '_shared_'}
                        onClick={() => {
                          setOpenDialog(true);
                          setRemoveFolderName(currentFolder);
                        }}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                  {inputName !== undefined && (
                    <>
                      <TextField
                        fullWidth
                        autoFocus
                        size="small"
                        value={inputName}
                        error={folderList.includes(inputName)}
                        onChange={handleInputName}
                        onFocus={handleInputFocus}
                        onKeyUp={handleInputEnter}
                      />
                      <Button
                        variant="text"
                        startIcon={<Done />}
                        disabled={
                          inputName === '' || folderList.includes(inputName)
                        }
                        onClick={createFolder}
                      >
                        확인
                      </Button>
                      <Button
                        variant="text"
                        startIcon={<Cancel />}
                        onClick={() => setInputName(undefined)}
                      >
                        취소
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="end">
                {!moveInfo && (
                  <>
                    <Button
                      variant="text"
                      startIcon={<FlipToFront />}
                      disabled={selection.length === 0}
                      onClick={setMoveMode}
                    >
                      이동/복사
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<Delete />}
                      disabled={selection.length === 0}
                      onClick={handleDelete}
                    >
                      선택 삭제
                    </Button>
                  </>
                )}
                {moveInfo && (
                  <>
                    <Button
                      variant="text"
                      startIcon={<FlipToFront />}
                      disabled={moveInfo.folder === currentFolder}
                      name="move"
                      onClick={handleMove}
                    >
                      이동
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<FileCopy />}
                      disabled={moveInfo.folder === currentFolder}
                      name="copy"
                      onClick={handleCopy}
                    >
                      복사
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<Cancel />}
                      onClick={cancelMoveMode}
                    >
                      취소
                    </Button>
                  </>
                )}
              </Stack>
              <ImageSelector
                rows={imgList[currentFolder]}
                disabled={!!moveInfo}
                onSelect={(update) => setSelection(update)}
                onEdit={handleChange}
              />
            </Paper>
          </ListItem>
        </List>
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>폴더 삭제</DialogTitle>
        <DialogContent>{`'${removeFolderName}' 폴더를 삭제합니까?`}</DialogContent>
        <DialogActions>
          <Button onClick={removeFolder}>예</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(false)}
          >
            아니오
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
