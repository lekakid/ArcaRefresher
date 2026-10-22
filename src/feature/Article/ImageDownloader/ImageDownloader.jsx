import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, GlobalStyles, Portal } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import { ARTICLE_BODY, ARTICLE_LOADED, ARTICLE_MENU } from 'constants/selector';
import { useLoadChecker } from 'core/LoadChecker';

import ImageSelector from './internal/ImageSelector';
import DownloadWidget from './internal/DownloadWidget';
import { setOpen } from './slice';
import info from './info';

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

  const { enabled } = useSelector((state) => state[info.id].storage);
  const { open } = useSelector((state) => state[info.id]);
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
          startIcon={<PhotoLibraryIcon />}
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
