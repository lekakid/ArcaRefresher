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

import { ARTICLE_IMAGES } from 'core/selector';
import ImageSelector from './ImageSelector';
import Downloader from './Downloader';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function DownloadDialog({ open, onClose }) {
  const [data] = useState(() =>
    [...document.querySelectorAll(ARTICLE_IMAGES)].map((e) => {
      const url = e.src.split('?')[0];

      const orig = `${url}${e.tagName === 'VIDEO' ? '.gif' : ''}?type=orig`;
      const thumb = `${url}${e.tagName === 'VIDEO' ? '.gif' : ''}`;
      const [, ext] =
        e.tagName === 'VIDEO' ? [0, 'gif'] : url.match(/\.(.{3,4})$/);
      const [uploadName] = url.match(/[0-9a-f]{64}/g);

      return { orig, thumb, ext, uploadName };
    }),
  );
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
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle>이미지 다운로드 중</DialogTitle>
        <DialogContent>
          <Downloader data={downloadList} onFinish={handleFinish} />
        </DialogContent>
      </Dialog>
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
        <ImageSelector
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
