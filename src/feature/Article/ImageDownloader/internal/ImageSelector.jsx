import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  ImageList,
  Switch,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {
  ARTICLE_EMOTICON,
  ARTICLE_GIFS,
  ARTICLE_IMAGES,
} from 'constants/selector';

import { EmoticonInfo, ImageInfo } from '../Model';
import { $toggleDownloadOrigin, setOpen } from '../slice';
import info from '../info';
import QueuedImageListItem from './QueuedImageListItem';

function mapDownloadInfo(arr, type) {
  if (type === undefined) {
    throw new Error('[mapDownloadInfo] type 미지정');
  }

  return arr
    .map((i) => {
      try {
        switch (type) {
          case 'image':
            return new ImageInfo(i);
          case 'emoticon':
            return new EmoticonInfo(i);
          default:
            return null;
        }
      } catch (error) {
        console.warn(error);
        return null;
      }
    })
    .filter((i) => i);
}

function ImageSelector({ open, onConfirm }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const {
    // 동작 설정
    downloadOrigin,
  } = useSelector((state) => state[info.id].storage);

  const [data, setData] = useState(undefined);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    if (!open) return;
    if (data) return;

    (async () => {
      const isEmotList = window.location.pathname.includes('/e/');
      if (isEmotList) {
        const bundleId = window.location.pathname.replace('/e/', '');
        try {
          const response = await fetch(`/api/emoticon/${bundleId}`);
          if (!response.ok) throw Error(response.statusText);

          const emotJson = await response.json();
          const emotData = mapDownloadInfo(emotJson, 'emoticon');
          setData(emotData);
          setSelection([...emotData.keys()]);
          return;
        } catch (_) {
          console.warn('[ImageDownloader] 아카콘 번들 데이터 획득 실패');
        }
      }
      const query = isEmotList
        ? ARTICLE_EMOTICON
        : `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`;
      const imageList = [...document.querySelectorAll(query)];
      const imageData = mapDownloadInfo(imageList, 'image');
      setData(imageData);

      setSelection([...imageData.keys()]);
    })();
  }, [open, data]);

  const handleSelect = useCallback(
    (index) => () => {
      const next = selection.includes(index)
        ? selection.filter((s) => s !== index)
        : [...selection, index];

      setSelection(next);
    },
    [selection],
  );

  const handleSelectAll = useCallback(() => {
    setSelection(
      selection.length === data.length
        ? []
        : [...new Array(data.length).keys()],
    );
  }, [data, selection]);

  const handleDownload = useCallback(async () => {
    setSelection([]);

    const selectedInfoList = selection
      .sort((a, b) => a - b)
      .map((i) => data[i]);
    onConfirm(selectedInfoList);

    dispatch(setOpen(false));
  }, [selection, onConfirm, data, dispatch]);

  const handleClose = useCallback(() => {
    dispatch(setOpen(false));
  }, [dispatch]);

  const handleSubmit = useCallback(
    (e) => {
      if (e.key && e.key !== 'Enter') return;
      if (selection.length === 0) return;

      handleDownload();
    },
    [handleDownload, selection],
  );

  const imgList = data?.map(({ thumb }) => thumb);
  if (!imgList) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
            게시물 내 이미지 목록을 확인 중입니다...
          </DialogContentText>
          <CircularProgress color="primary" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      onKeyUp={handleSubmit}
    >
      <DialogTitle>이미지 다운로더</DialogTitle>
      <IconButton
        size="large"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <ImageList cols={mobile ? 3 : 6} rowHeight={mobile ? 100 : 180}>
          {imgList.map((img, index) => (
            <QueuedImageListItem
              key={`${img}_${index}`}
              src={img}
              alt={`${index + 1}번 이미지`}
              checked={selection.includes(index)}
              onClick={handleSelect(index)}
            />
          ))}
        </ImageList>
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          label="원본"
          control={
            <Switch
              checked={downloadOrigin}
              onChange={() => dispatch($toggleDownloadOrigin())}
            />
          }
        />

        <Typography>{`${selection.length}/${imgList.length}`}</Typography>
        <Button onClick={handleSelectAll}>
          {selection.length !== data.length ? '전체 선택' : '선택 해제'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selection.length === 0}
          onClick={handleDownload}
        >
          다운로드
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ImageSelector.propTypes = {
  open: PropTypes.bool,
  onConfirm: PropTypes.func,
};

export default ImageSelector;
