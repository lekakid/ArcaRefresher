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
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Writer } from '@transcend-io/conflux';
import streamSaver from 'streamsaver';

import { ARTICLE_EMOTICON, ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContent } from 'hooks/Content';
import { request } from 'func/http';

import SelectableImageList from './SelectableImageList';
import { EmoticonInfo, format, ImageInfo } from './func';
import { $toggleDownloadOrigin, setOpen } from './slice';
import Info from './FeatureInfo';

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

function DownloadDialog() {
  const dispatch = useDispatch();
  const contentInfo = useContent();

  const {
    // 동작 설정
    downloadOrigin,
    // 파일 포맷
    startWithZero,
    zipImageName,
    zipName,
    zipExtension,
  } = useSelector((state) => state[Info.id].storage);
  const { open } = useSelector((state) => state[Info.id]);

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
          setData(mapDownloadInfo(emotJson, 'emoticon'));
          setSelection([...new Array(emotJson.length).keys()]);
          return;
        } catch (error) {
          console.warn('[ImageDownloader] 아카콘 번들 데이터 획득 실패');
        }
      }
      const query = isEmotList
        ? ARTICLE_EMOTICON
        : `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`;
      const imageList = [...document.querySelectorAll(query)];
      setData(mapDownloadInfo(imageList, 'image'));

      setSelection([...new Array(imageList.length).keys()]);
    })();
  }, [open, data]);

  const handleSelection = useCallback((sel) => {
    setSelection(sel);
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelection(
      selection.length === data.length
        ? []
        : [...new Array(data.length).keys()],
    );
  }, [data, selection]);

  const handleDownload = useCallback(async () => {
    setSelection([]);

    const selectedItems = data.map(() => false);
    selection.forEach((s) => {
      selectedItems[s] = true;
    });
    const imageInfoList = selectedItems
      .map((s, i) => (s ? data[i] : undefined))
      .filter((d) => !!d);

    const confirm = (event) => {
      event.preventDefault();
      const message =
        '지금 창을 닫으면 다운로드가 중단됩니다. 계속하시겠습니까?';
      event.returnValue = message;
      return message;
    };

    let count = startWithZero ? 0 : 1;
    // 파일명 중복 시 끝에 숫자 붙이는 용도
    const dupCount = {};

    // 페이지 이탈 방지
    window.addEventListener('beforeunload', confirm);
    dispatch(setOpen(false));

    // Conflux 압축파일 스트림 생성
    const { readable, writable } = new Writer();
    const writer = writable.getWriter();

    // 파일 저장 스트림 생성
    const zipFileName = format(zipName, { content: contentInfo });
    const filestream = streamSaver.createWriteStream(
      `${zipFileName}.${zipExtension}`,
    );

    // Conflux -> streamSaver 연결
    readable.pipeTo(filestream);

    // 다운로드 시작
    for (let i = 0; i < imageInfoList.length; i += 1) {
      const info = imageInfoList[i];

      const { url, orig, ext, name } = info;

      let imageName = format(zipImageName, {
        content: contentInfo,
        index: count,
        name,
      });
      imageName =
        dupCount[imageName] > 0
          ? `${imageName}(${dupCount[imageName]})`
          : imageName;
      dupCount[imageName] = (dupCount[imageName] || 0) + 1;

      count += 1;
      try {
        // eslint-disable-next-line no-await-in-loop
        const stream = await request(downloadOrigin ? orig : url, {
          responseType: 'blob',
        }).then(({ response }) => response.stream());

        writer.write({
          name: `${imageName}.${ext}`,
          stream: () => stream,
        });
      } catch (error) {
        console.warn('[ImageDownloader] 이미지를 받지 못했습니다.', error);
      }
    }

    writer.close();
  }, [
    data,
    selection,
    downloadOrigin,
    startWithZero,
    zipName,
    contentInfo,
    zipExtension,
    zipImageName,
    dispatch,
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

export default DownloadDialog;
