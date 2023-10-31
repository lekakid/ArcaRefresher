import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Portal } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { GetApp } from '@material-ui/icons';

import { ARTICLE_BODY, ARTICLE_LOADED, ARTICLE_MENU } from 'core/selector';
import { useLoadChecker } from 'hooks';

import SelectionDialog from './SelectionDialog';
import Info from './FeatureInfo';
import { setOpen } from './slice';

const useStyles = makeStyles({
  root: {
    '& #imageToZipBtn': {
      display: 'none',
    },
  },
  btn: {
    borderColor: 'var(--color-border-outer)',
    color: 'var(--color-text-color)',
  },
});

export default function ImageDownloader() {
  const dispatch = useDispatch();
  const {
    storage: { enabled },
    open,
  } = useSelector((state) => state[Info.ID]);
  const [container, setContainer] = useState(null);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const classes = useStyles();

  useEffect(() => {
    if (!enabled) return null;
    if (!articleLoaded) return null;

    const menu = document.querySelector(ARTICLE_MENU);
    if (!menu) {
      if (!container) {
        setContainer(
          document
            .querySelector(ARTICLE_BODY)
            .insertAdjacentElement('afterend', document.createElement('div')),
        );
      }
      return null;
    }

    menu.classList.add(classes.root);
    if (!container) {
      const tmp = document.createElement('span');
      tmp.classList.add('float-left');
      menu.insertAdjacentElement('afterbegin', tmp);
      setContainer(tmp);
    }

    return () => {
      menu.classList.remove(classes.root);
    };
  }, [articleLoaded, classes, container, enabled]);

  const handleOpen = useCallback(() => {
    dispatch(setOpen(true));
  }, [dispatch]);

  if (!container) return null;
  if (!enabled) return null;

  return (
    <>
      <Portal container={container}>
        <Button
          variant="outlined"
          classes={{ root: classes.btn }}
          size="small"
          startIcon={<GetApp />}
          disabled={open}
          onClick={handleOpen}
        >
          이미지 다운로더
        </Button>
      </Portal>
      <SelectionDialog />
    </>
  );
}
