import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, GlobalStyles, Portal } from '@mui/material';
import { PhotoLibrary } from '@mui/icons-material';

import { ARTICLE_BODY, ARTICLE_LOADED, ARTICLE_MENU } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import ImageSelector from './ImageSelector';
import DownloadWidget from './DownloadWidget';
import { setOpen } from './slice';
import Info from './FeatureInfo';

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
  const [container] = useState(() => document.createElement('div'));
  const [downloadInfoList, setDownloadInfoList] = useState([]);

  useEffect(() => {
    if (!enabled) return;
    if (!articleLoaded) return;

    const menu = document.querySelector(ARTICLE_MENU);
    if (!menu) {
      document
        .querySelector(ARTICLE_BODY)
        .insertAdjacentElement('afterend', container);
      return;
    }

    container.classList.toggle('float-start', true);
    // eslint-disable-next-line react-hooks/immutability
    container.style.display = 'inline';
    menu.insertAdjacentElement('afterbegin', container);

    return () => {
      container.style.display = '';
      container.remove();
    };
  }, [articleLoaded, container, enabled]);

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
          onClick={() => dispatch(setOpen(true))}
        >
          리프레셔 다운로더
        </Button>
      </Portal>
      <ImageSelector
        open={open}
        onConfirm={(list) => setDownloadInfoList(list)}
      />
      <DownloadWidget
        infoList={downloadInfoList}
        onDownloadStart={() => setDownloadInfoList([])}
      />
    </>
  );
}
