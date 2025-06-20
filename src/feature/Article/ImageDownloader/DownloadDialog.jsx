import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Writer } from '@transcend-io/conflux';
import streamSaver from 'streamsaver';

import { ARTICLE_EMOTICON, ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContent } from 'hooks/Content';

import SelectableImageList from './SelectableImageList';
import { format, getImageInfo } from './func';
import { setOpen } from './slice';
import Info from './FeatureInfo';

function delay(interval) {
  if (!interval) return Promise.resolve();

  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
}

async function fetchWithRetry(url, opt, tryOpt) {
  const { tryCount, interval } = tryOpt;

  let count = 0;
  while (count < tryCount) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fetch(url, opt);
    } catch (error) {
      // eslint-disable-next-line no-await-in-loop
      await delay(interval);
      count += 1;
    }
  }
  throw new Error('[fetchWithRetry] 시도 횟수 초과');
}

function DownloadDialog() {
  const dispatch = useDispatch();
  const contentInfo = useContent();

  const { startWithZero, zipImageName, zipName, zipExtension } = useSelector(
    (state) => state[Info.id].storage,
  );
  const { open } = useSelector((state) => state[Info.id]);

  const [data, setData] = useState(undefined);
  const [selection, setSelection] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (data) return;

    const isEmotShop = window.location.pathname.indexOf('/e/') !== -1;
    const query = isEmotShop
      ? ARTICLE_EMOTICON
      : `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`;
    const imageList = [...document.querySelectorAll(query)];
    setData(
      imageList.reduce((acc, image) => {
        try {
          acc.push(getImageInfo(image));
        } catch (error) {
          console.warn('[ImageDownloader]', error);
        }
        return acc;
      }, []),
    );

    setSelection([...new Array(imageList.length).keys()]);
  }, [open, data]);

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
    setSelection([]);
    setShowProgress(true);

    const selectedTable = data.map(() => false);
    selection.forEach((s) => {
      selectedTable[s] = true;
    });
    const selectedImages = selectedTable
      .map((s, i) => (s ? data[i] : undefined))
      .filter((d) => !!d);

    let totalSize = 0;
    const availableImages = await selectedImages.reduce(
      async (promise, info, index) => {
        try {
          await delay(Math.floor(index / 5) * 200);
          const response = await fetchWithRetry(
            info.orig,
            {
              method: 'HEAD',
            },
            {
              tryCount: 3,
              interval: 1000,
            },
          );
          if (!response.ok) throw new Error('서버 접속 실패');

          const acc = await promise;

          const size = Number(response.headers.get('content-length'));
          totalSize += size;

          acc.push(info);
          return acc;
        } catch (error) {
          console.warn('[ImageDownloader] 이미지를 처리할 수 없습니다.', error);
          return promise;
        }
      },
      [],
    );

    const iterator = availableImages.values();

    const confirm = (event) => {
      event.preventDefault();
      const message =
        '지금 창을 닫으면 다운로드가 중단됩니다. 계속하시겠습니까?';
      event.returnValue = message;
      return message;
    };

    let count = startWithZero ? 0 : 1;
    const dupCount = {};
    const myReadable = new ReadableStream({
      start() {
        dispatch(setOpen(false));
        window.addEventListener('beforeunload', confirm);
      },
      async pull(controller) {
        const { done, value } = iterator.next();
        if (done) {
          window.removeEventListener('beforeunload', confirm);
          return controller.close();
        }

        const { orig, ext, uploadName } = value;
        const name = format(zipImageName, {
          content: contentInfo,
          index: count,
          fileName: uploadName,
        });
        const finalName =
          dupCount[name] > 0 ? `${name}(${dupCount[name]})` : name;
        dupCount[name] = dupCount[name] > 0 ? dupCount[name] + 1 : 1;

        count += 1;
        try {
          const stream = await fetchWithRetry(orig, undefined, {
            tryCount: 5,
            interval: 1000,
          }).then((response) => response.body);
          return controller.enqueue({
            name: `${finalName}.${ext}`,
            stream: () => stream,
          });
        } catch (error) {
          console.warn('[ImageDownloader] 이미지를 받지 못했습니다.', error);
          return undefined;
        }
      },
      cancel() {
        window.removeEventListener('beforeunload', confirm);
      },
    });

    const zipFileName = format(zipName, { content: contentInfo });

    myReadable.pipeThrough(new Writer()).pipeTo(
      streamSaver.createWriteStream(`${zipFileName}.${zipExtension}`, {
        size: totalSize,
      }),
    );
  }, [
    dispatch,
    data,
    selection,
    zipName,
    contentInfo,
    startWithZero,
    zipExtension,
    zipImageName,
  ]);

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

  if (showProgress) {
    return (
      <Dialog
        open={open}
        slotProps={{
          transition: {
            onExited() {
              setShowProgress(false);
            },
          },
        }}
      >
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
            선택한 이미지들의 데이터를 확인하는 중입니다...
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
        <Close />
      </IconButton>
      <DialogContent>
        <SelectableImageList
          imgList={imgList}
          selection={selection}
          onChange={handleSelection}
        />
      </DialogContent>
      <DialogActions>
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

export default DownloadDialog;
