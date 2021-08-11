import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  CircularProgress,
  DialogContent,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import fetch from '../$Common/Fetch';

import { MODULE_ID } from './ModuleInfo';
import { SET_FINISH } from './DialogReducer';
import { getArticleInfo, replaceFlag } from './FlagHandler';

async function download({
  dataList,
  onTotalProgress,
  onFileProgress,
  articleInfo,
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
          ...articleInfo,
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
    comment: replaceFlag(zipComment, articleInfo),
  });
  saveAs(zipblob, `${replaceFlag(zipName, articleInfo)}.zip`);
}

export default function DownloadProgress(props) {
  const config = useSelector((state) => state[MODULE_ID]);
  const {
    state: { target },
    dispatch,
  } = props;
  const [articleInfo, setArticleInfo] = useState(null);
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setArticleInfo(getArticleInfo());
  }, []);

  useEffect(() => {
    if (articleInfo && target.length > 0) {
      (async () => {
        await download({
          dataList: target,
          onTotalProgress(current) {
            setCur(current);
          },
          onFileProgress({ loaded, total }) {
            setProgress((loaded / total) * 100);
          },
          articleInfo,
          config,
        });
        dispatch({ type: SET_FINISH });
      })();
    }
  }, [articleInfo, config, dispatch, target]);

  if (cur === target.length) {
    return (
      <DialogContent>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <Typography>{`다운로드 중 ${cur}/${target.length}`}</Typography>
      <LinearProgress
        variant="determinate"
        value={(cur / target.length) * 100}
      />
      <Typography>{`${Math.floor(progress)}%`}</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </DialogContent>
  );
}
