import { makeStyles } from '@material-ui/styles';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { addAREvent, EVENT_COMMENT_REFRESH, removeAREvent } from 'core/event';
import {
  ARTICLE_IMAGES,
  ARTICLE_LOADED,
  ARTICLE_VIEW,
  BOARD_LOADED,
  BOARD_VIEW,
  COMMENT_EMOTICON,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';

import { MODULE_ID } from '../ModuleInfo';

const useStyles = makeStyles(() => ({
  '@global': {
    '.filtered-emoticon': {
      width: 'auto !important',
      height: 'auto !important',
      textDecoration: 'none !important',
    },
    '.filtered-emoticon::after': {
      color: 'var(--color-text-color)',
      content: '"[아카콘 뮤트됨]"',
    },
    '.filtered-emoticon > img, .filtered-emoticon > video': {
      display: 'none !important',
    },
  },
}));

export default function EmoticonMuter() {
  const { emoticon } = useSelector((state) => state[MODULE_ID]);
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);
  const [board, setBoard] = useState(null);
  const [article, setArticle] = useState(null);
  const bundleList = Object.values(emoticon).reduce(
    (acc, { bundle }) => [...acc, ...bundle],
    [],
  );
  const urlList = Object.values(emoticon).reduce(
    (acc, { url }) => [...acc, ...url],
    [],
  );
  useStyles();

  useEffect(() => {
    if (boardLoaded) setBoard(document.querySelector(BOARD_VIEW));
  }, [boardLoaded]);

  useEffect(() => {
    if (articleLoaded) setArticle(document.querySelector(ARTICLE_VIEW));
  }, [articleLoaded]);

  useEffect(() => {
    if (!article) return null;

    const muteArticle = () => {
      const articleImage = [...document.querySelectorAll(ARTICLE_IMAGES)];
      articleImage.forEach((i) => {
        const { clientWidth: width, clientHeight: height, src } = i;

        // Normal Image
        if (width > 100 || height > 100) return;

        // eslint-disable-next-line no-unused-expressions
        i.closest('a')?.classList.toggle(
          'filtered-emoticon',
          urlList.indexOf(src.replace('https:', '')) > -1,
        );
      });
    };

    const muteComment = () => {
      const commentEmot = document.querySelectorAll(COMMENT_EMOTICON);
      commentEmot.forEach((c) => {
        const id = Number(c.dataset.id);
        c.parentNode.classList.toggle(
          'filtered-emoticon',
          bundleList.indexOf(id) > -1,
        );
      });
    };

    window.addEventListener('load', muteArticle);
    addAREvent(EVENT_COMMENT_REFRESH, muteComment);
    muteComment();

    return () => {
      window.removeEventListener('load', muteArticle);
      removeAREvent(EVENT_COMMENT_REFRESH, muteComment);
    };
  }, [article, bundleList, urlList]);

  useEffect(() => {
    if (!board) return;

    const images = board.querySelectorAll(
      '.vrow-preview noscript, .vrow-preview img',
    );
    images.forEach((e) => {
      const url = e.matches('img')
        ? e.src.replace('https:', '').replace('?type=list', '')
        : e.textContent.match(/\/\/.+\?/g)[0].replace('?', '');

      if (urlList.indexOf(url) > -1) {
        e.parentNode.remove();
      }
    });
  }, [board, urlList]);

  return null;
}
