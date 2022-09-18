import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { Writer } from '@transcend-io/conflux';
import streamSaver from 'streamsaver';

import { ARTICLE_EMOTICON, ARTICLE_IMAGES } from 'core/selector';
import { useParser } from 'util/Parser';

import { getArticleInfo, getBlob, getImageInfo, replaceFormat } from '../func';
import Info from '../FeatureInfo';
import SelectableImageList from './SelectableImageList';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function SelectionDialog({ open, onClose }) {
  const { channelID, channelName } = useParser();
  const { zipImageName, zipName } = useSelector((state) => state[Info.ID]);
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
  const articleInfo = useRef(getArticleInfo());
  const [selection, setSelection] = useState([]);

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
    const selectedData = data.filter((_data, index) =>
      selection.includes(index),
    );
    const iterator = selectedData.values();
    let count = 1;

    const myReadable = new ReadableStream({
      async pull(controller) {
        const { done, value } = iterator.next();
        if (done) return controller.close();
        const { orig, ext, uploadName } = value;

        const blob = await getBlob({
          url: orig,
        });
        const name = replaceFormat(zipImageName, {
          ...articleInfo.current,
          channelID,
          channelName,
          uploadName,
          index: count,
        });

        count += 1;
        return controller.enqueue({
          name: `/${name}.${ext}`,
          stream: () => new Response(blob).body,
        });
      },
    });

    const zipFileName = replaceFormat(zipName, {
      ...articleInfo.current,
      channelID,
      channelName,
    });

    myReadable
      .pipeThrough(new Writer())
      .pipeTo(streamSaver.createWriteStream(`${zipFileName}.zip`));
    setSelection([]);
    onClose();
  }, [channelID, channelName, data, onClose, selection, zipImageName, zipName]);

  const classes = useStyles();

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
