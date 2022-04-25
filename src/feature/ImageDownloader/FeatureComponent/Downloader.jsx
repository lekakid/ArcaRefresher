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

import { MODULE_ID } from '../ModuleInfo';
import { getArticleInfo, getBlob, replaceFormat } from '../func';

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

export default function Downloader({ open, data, onFinish }) {
  const { channelID, channelName } = useParser();
  const { zipImageName, zipName, zipComment, retryCount } = useSelector(
    (state) => state[MODULE_ID],
  );
  const articleInfo = useRef(getArticleInfo());
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);
  const { root, card } = useStyles();

  useEffect(() => {
    if (data.length === 0) return;
    if (!articleInfo.current) return;

    (async () => {
      const zip = new JSZip();

      for (let i = 0; i < data.length; i += 1) {
        const { orig, ext, uploadName } = data[i];
        setCur(i);

        try {
          // eslint-disable-next-line no-await-in-loop
          const blob = await getBlob({
            url: orig,
            onprogress({ loaded, total }) {
              setProgress((loaded / total) * 100);
            },
          });

          const saveFilename = replaceFormat(zipImageName, {
            ...articleInfo.current,
            channelID,
            channelName,
            uploadName,
            index: i,
          });
          zip.file(`${saveFilename}.${ext}`, blob);
        } catch (error) {
          console.warn('다운로드 실패', orig, error);
        }
      }
      setCur(data.length);

      const replacedComment = replaceFormat(zipComment, {
        ...articleInfo.current,
        channelID,
        channelName,
      });
      const zipFileName = replaceFormat(zipName, {
        ...articleInfo.current,
        channelID,
        channelName,
      });

      const zipblob = await zip.generateAsync({
        type: 'blob',
        comment: replacedComment,
      });
      saveAs(zipblob, `${zipFileName}.zip`);
      onFinish();
    })();
  }, [
    channelID,
    channelName,
    data,
    onFinish,
    retryCount,
    zipComment,
    zipImageName,
    zipName,
  ]);

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
