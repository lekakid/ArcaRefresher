import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, GlobalStyles, Portal } from '@mui/material';
import { PhotoLibrary } from '@mui/icons-material';

import { ARTICLE_BODY, ARTICLE_LOADED, ARTICLE_MENU } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import DownloadDialog from './DownloadDialog';
import Info from './FeatureInfo';
import { setOpen } from './slice';

const hideButtonStyles = (
  <GlobalStyles
    styles={{
      '#imageToZipBtn': {
        display: 'none',
      },
    }}
  />
);

export default function ImageDownloader() {
  const dispatch = useDispatch();
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  const { enabled } = useSelector((state) => state[Info.id].storage);
  const { open } = useSelector((state) => state[Info.id]);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    if (!articleLoaded) return;

    const menu = document.querySelector(ARTICLE_MENU);
    if (!menu) {
      if (!container) {
        setContainer(
          document
            .querySelector(ARTICLE_BODY)
            .insertAdjacentElement('afterend', document.createElement('div')),
        );
      }
      return;
    }

    if (!container) {
      const tmp = document.createElement('span');
      tmp.classList.add('float-left');
      menu.insertAdjacentElement('afterbegin', tmp);
      setContainer(tmp);
    }
  }, [articleLoaded, container, enabled]);

  const handleOpen = useCallback(() => {
    dispatch(setOpen(true));
  }, [dispatch]);

  if (!container) return null;
  if (!enabled) return null;
  return (
    <>
      {hideButtonStyles}
      <Portal container={container}>
        <Button
          sx={{
            borderColor: 'var(--color-border-outer)',
            color: 'var(--color-text-color)',
          }}
          size="small"
          startIcon={<PhotoLibrary />}
          disabled={open}
          onClick={handleOpen}
        >
          리프레셔 다운로더
        </Button>
      </Portal>
      <DownloadDialog />
    </>
  );
}
