import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import { Writer } from '@transcend-io/conflux';
import streamSaver from 'streamsaver';

import { ARTICLE_EMOTICON, ARTICLE_IMAGES } from 'core/selector';
import { useParser } from 'util/Parser';

import { getArticleInfo, getImageInfo, replaceFormat } from './func';
import Info from './FeatureInfo';
import SelectableImageList from './SelectableImageList';

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});

function SelectionDialog({ classes, open, onClose }) {
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
  const [alertOpen, setAlertOpen] = useState(false);

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
    setAlertOpen(true);

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
          ...articleInfo.current,
          channelID,
          channelName,
          uploadName,
          index: count,
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

    const zipFileName = replaceFormat(zipName, {
      ...articleInfo.current,
      channelID,
      channelName,
    });

    myReadable.pipeThrough(new Writer()).pipeTo(
      streamSaver.createWriteStream(`${zipFileName}.zip`, {
        size: totalSize,
      }),
    );
  }, [channelID, channelName, data, onClose, selection, zipImageName, zipName]);

  const handleClose = useCallback(() => {
    setAlertOpen(false);
  }, []);

  const imgList = data.map(({ thumb }) => thumb);

  return (
    <>
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
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message={
          <>
            <div>다운로드를 시작하는데 약간의 시간이 걸릴 수 있습니다.</div>
            <div>
              다운로드를 진행하는 동안 다른 페이지로 이동하거나 창을 닫지
              마십시오.
            </div>
          </>
        }
      />
    </>
  );
}

export default withStyles(styles)(SelectionDialog);
