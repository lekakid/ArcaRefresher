import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { ARTICLE_EMOTICON, ARTICLE_IMAGES } from 'core/selector';
import { getImageInfo } from '../func';
import SelectableImageList from './SelectableImageList';
import Downloader from './Downloader';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function SelectionDialog({ open, onClose }) {
  const [data] = useState(() => {
    const emoticon = window.location.pathname.indexOf('/e/') !== -1;
    const query = emoticon ? ARTICLE_EMOTICON : ARTICLE_IMAGES;
    const imageList = [...document.querySelectorAll(query)];
    const dataResult = imageList.reduce((acc, image) => {
      try {
        acc.push(getImageInfo(image));
      } catch (error) {
        console.warn('[ImageDownloader]', error);
      }
      return acc;
    }, []);

    return dataResult;
  });
  const [selection, setSelection] = useState([]);
  const [downloadList, setDownloadList] = useState([]);
  const [downloader, setDownloader] = useState(false);

  useEffect(() => {
    if (open) setDownloader(false);
  }, [open]);

  const handleSelection = useCallback((sel) => {
    setSelection(sel);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selection.length !== data.length) {
      setSelection([...new Array(data.length).keys()]);
      return;
    }
    setSelection([]);
  }, [data, selection]);

  const handleDownload = useCallback(() => {
    const downloadData = data
      .filter((d, index) => selection.includes(index))
      .map(({ orig, ext, uploadName }) => ({
        orig,
        ext,
        uploadName,
      }));
    setDownloadList(downloadData);
    setSelection([]);
    setDownloader(true);
  }, [data, selection]);

  const handleFinish = useCallback(() => {
    setDownloadList([]);
    onClose();
  }, [onClose]);

  const classes = useStyles();

  if (downloader) {
    return (
      <Downloader open={open} data={downloadList} onFinish={handleFinish} />
    );
  }

  const imgList = data.map(({ thumb }) => thumb);

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>
        <Typography>이미지 다운로더</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SelectableImageList
          imgList={imgList}
          selection={selection}
          onChange={handleSelection}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSelectAll}>
          {selection.length !== data.length ? '전체 선택' : '선택 해제'}
        </Button>
        <Button disabled={selection.length === 0} onClick={handleDownload}>
          다운로드
        </Button>
      </DialogActions>
    </Dialog>
  );
}
