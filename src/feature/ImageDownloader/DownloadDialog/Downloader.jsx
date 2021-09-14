import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { useParser } from 'util/Parser';
import fetch from 'util/fetch';

import { MODULE_ID } from '../ModuleInfo';
import { getArticleInfo, replaceFlag } from '../func';

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
          timeout: 20000,
          responseType: 'blob',
          onprogress: onFileProgress,
        });
        const saveName = replaceFlag(zipImageName, {
          ...flags,
          uploadName,
          index: i,
        });
        zip.file(`${saveName}.${ext}`, blob);
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
    comment: replaceFlag(zipComment, flags),
  });
  saveAs(zipblob, `${replaceFlag(zipName, flags)}.zip`);
}

export default function Downloader({ data, onFinish }) {
  const { channelID, channelName } = useParser();
  const config = useSelector((state) => state[MODULE_ID]);
  const articleInfo = useRef(() => getArticleInfo());
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (data.length === 0) return;

    if (articleInfo) {
      const flags = {
        channelID,
        channelName,
        ...articleInfo,
      }(async () => {
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
    }
  }, [articleInfo, channelID, channelName, config, data, onFinish]);

  if (cur === data.length) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box diaplay="flex">
      <Typography>{`다운로드 중 ${cur}/${data.length}`}</Typography>
      <LinearProgress variant="determinate" value={(cur / data.length) * 100} />
      <Typography>{`${Math.floor(progress)}%`}</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
