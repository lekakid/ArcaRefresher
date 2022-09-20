import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import { Writer } from '@transcend-io/conflux';
import streamSaver from 'streamsaver';

import { ARTICLE_EMOTICON, ARTICLE_IMAGES } from 'core/selector';
import { useParser } from 'util/Parser';

import { getImageInfo, replaceFormat } from './func';
import Info from './FeatureInfo';
import SelectableImageList from './SelectableImageList';

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  progressContainer: {
    textAlign: 'center',
  },
});

function SelectionDialog({ classes, open, onClose }) {
  const infoString = useParser();
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
  const [selection, setSelection] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

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

  const handleDownload = useCallback(async () => {
    onClose();
    setSelection([]);
    setShowProgress(true);

    const selectedData = data.filter((_data, index) =>
      selection.includes(index),
    );

    const totalSize = await selectedData.reduce(
      async (acc, { orig }) =>
        (await acc) +
        (await fetch(orig, { method: 'HEAD' }).then(
          (response) => Number(response.headers.get('Content-Length')) || 0,
        )),
      0,
    );

    const iterator = selectedData.values();
    let count = 1;

    const confirm = (event) => {
      // eslint-disable-next-line no-param-reassign
      event.returnValue =
        '지금 창을 닫으면 다운로드가 중단됩니다. 계속하시겠습니까?';
    };

    const myReadable = new ReadableStream({
      start() {
        setShowProgress(false);
        window.addEventListener('beforeunload', confirm);
      },
      async pull(controller) {
        const { done, value } = iterator.next();
        if (done) {
          window.removeEventListener('beforeunload', confirm);
          return controller.close();
        }
        const { orig, ext, uploadName } = value;

        const name = replaceFormat(zipImageName, {
          strings: infoString,
          index: count,
          fileName: uploadName,
        });

        const stream = await fetch(orig).then((response) => response.body);
        count += 1;
        return controller.enqueue({
          name: `/${name}.${ext}`,
          stream: () => stream,
        });
      },
      cancel() {
        window.removeEventListener('beforeunload', confirm);
      },
    });

    const zipFileName = replaceFormat(zipName, { strings: infoString });

    myReadable.pipeThrough(new Writer()).pipeTo(
      streamSaver.createWriteStream(`${zipFileName}.zip`, {
        size: totalSize,
      }),
    );
  }, [data, infoString, onClose, selection, zipImageName, zipName]);

  const imgList = data.map(({ thumb }) => thumb);

  if (showProgress) {
    return (
      <Dialog maxWidth="lg" open>
        <DialogTitle>
          <Typography>이미지 다운로더</Typography>
        </DialogTitle>
        <DialogContent classes={{ root: classes.progressContainer }}>
          <Typography>다운로드를 준비 중입니다...</Typography>
          <CircularProgress color="primary" />
        </DialogContent>
      </Dialog>
    );
  }

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

export default withStyles(styles)(SelectionDialog);