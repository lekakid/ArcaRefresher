import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Writer } from '@transcend-io/conflux';
import streamSaver from 'streamsaver';

import { ARTICLE_EMOTICON, ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContent } from 'hooks/Content';
import { request } from 'func/http';

import SelectableImageList from './SelectableImageList';
import { format, getImageInfo } from './func';
import { setOpen } from './slice';
import Info from './FeatureInfo';

function DownloadDialog() {
  const dispatch = useDispatch();
  const contentInfo = useContent();
  const { downloadMethod, zipImageName, zipName, zipExtension } = useSelector(
    (state) => state[Info.id].storage,
  );
  const { open } = useSelector((state) => state[Info.id]);
  const data = useMemo(() => {
    const isEmotShop = window.location.pathname.indexOf('/e/') !== -1;
    const query = isEmotShop
      ? ARTICLE_EMOTICON
      : `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`;
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
  }, []);
  const [selection, setSelection] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (open) {
      setSelection([...new Array(data.length).keys()]);
    }
  }, [data, open]);

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
    dispatch(setOpen(false));
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
      async (promise, info) => {
        try {
          switch (downloadMethod) {
            case 'fetch': {
              const response = await fetch(info.orig, {
                method: 'HEAD',
              });
              if (!response.ok) throw new Error('서버 접속 실패');

              const size = Number(response.headers.get('content-length'));
              totalSize += size;

              break;
            }
            case 'xhr+fetch':
            case 'xhr': {
              const response = await request(info.orig, {
                method: 'HEAD',
              });
              if (response.status !== 200) throw new Error('서버 접속 실패');

              const size =
                Number(
                  response.responseHeaders
                    .split('content-length: ')[1]
                    .split('\r')[0],
                ) || 0;
              totalSize += size;
              info.orig = response.finalUrl;

              break;
            }
            default: {
              throw new Error('다운로드 방식 설정값이 이상합니다.');
            }
          }
          const acc = await promise;
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

    let count = 1;
    const dupCount = {};
    const myReadable = new ReadableStream({
      start() {
        setOpen(false);
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
        switch (downloadMethod) {
          case 'fetch':
          case 'xhr+fetch': {
            const stream = await fetch(orig).then((response) => response.body);
            return controller.enqueue({
              name: `${finalName}.${ext}`,
              stream: () => stream,
            });
          }
          case 'xhr': {
            const stream = await request(orig, { responseType: 'blob' }).then(
              ({ response }) => response.stream(),
            );
            return controller.enqueue({
              name: `${finalName}.${ext}`,
              stream: () => stream,
            });
          }
          default:
            console.warn('[ImageDownload] 확인할 수 없는 다운로드 방식 사용');
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
    zipExtension,
    zipImageName,
    downloadMethod,
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

  const imgList = data.map(({ thumb }) => thumb);

  if (showProgress) {
    return (
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        TransitionProps={{ onExited: () => setShowProgress(false) }}
      >
        <DialogContent sx={{ textAlign: 'center' }}>
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
