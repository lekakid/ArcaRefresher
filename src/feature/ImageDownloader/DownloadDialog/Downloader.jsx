import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Slide,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { useParser } from 'util/Parser';
import fetch from 'util/fetch';

import { MODULE_ID } from '../ModuleInfo';
import { getArticleInfo, replaceFormat } from '../func';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(8),
    width: '100%',
    padding: theme.spacing(0, 2),
  },
  card: {
    margin: theme.spacing(0, 'auto'),
    width: '100%',
    maxWidth: theme.breakpoints.values.sm,
    zIndex: theme.zIndex.snackbar,
  },
}));

async function download({
  dataList,
  onTotalProgress,
  onFileProgress,
  flags,
  config: { zipName, zipImageName, zipComment, retryCount },
}) {
  const zip = new JSZip();

  const failedIndex = [];
  for (let i = 0; i < dataList.length; i += 1) {
    const { orig, ext, uploadName } = dataList[i];
    onTotalProgress(i);

    for (let j = 0; j < retryCount; j += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const { response: blob } = await fetch({
          url: orig,
          responseType: 'blob',
          onprogress: onFileProgress,
        });
        const saveFilename = replaceFormat(zipImageName, {
          ...flags,
          uploadName,
          index: i,
        });
        zip.file(`${saveFilename}.${ext}`, blob);
        break;
      } catch (error) {
        console.warn('다운로드 실패로 인한 재시도', orig, error);
      }

      if (j === retryCount - 1) failedIndex.push(i);
    }
  }
  onTotalProgress(dataList.length);

  const zipblob = await zip.generateAsync({
    type: 'blob',
    comment: replaceFormat(zipComment, flags),
  });
  saveAs(zipblob, `${replaceFormat(zipName, flags)}.zip`);
}

export default function Downloader({ open, data, onFinish }) {
  const { channelID, channelName } = useParser();
  const config = useSelector((state) => state[MODULE_ID]);
  const articleInfo = useRef(getArticleInfo());
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);
  const { root, card } = useStyles();

  useEffect(() => {
    if (data.length === 0) return;
    if (!articleInfo.current) return;

    const flags = {
      ...articleInfo.current,
      channelID,
      channelName,
    };
    (async () => {
      await download({
        dataList: data,
        onTotalProgress(current) {
          setCur(current);
        },
        onFileProgress({ loaded, total }) {
          setProgress((loaded / total) * 100);
        },
        flags,
        config,
      });
      onFinish();
    })();
  }, [articleInfo, channelID, channelName, config, data, onFinish]);

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box className={root}>
        <Card classes={{ root: card }}>
          <CardContent>
            {cur !== data.length && (
              <>
                <Typography>{`다운로드 중 ${cur}/${data.length}`}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(cur / data.length) * 100}
                />
                <Typography>{`${Math.floor(progress)}%`}</Typography>
                <LinearProgress variant="determinate" value={progress} />
              </>
            )}
            {cur === data.length && (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography>압축 파일 생성 중...</Typography>
                <CircularProgress />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Slide>
  );
}
