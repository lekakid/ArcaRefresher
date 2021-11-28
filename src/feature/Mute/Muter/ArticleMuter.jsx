import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { ARTICLE_IMAGES, ARTICLE_LOADED, ARTICLE_VIEW } from 'core/selector';
import { useElementQuery } from 'core/hooks';

import { MODULE_ID } from '../ModuleInfo';
import useEmoticon from './useEmoticon';

const style = {
  '@global': {
    '.article-content': {
      '& .filtered-emoticon': {
        '& img, & video': {
          display: 'none !important',
        },
        '&::after': {
          position: 'inherit !important',
          bottom: 'unset !important',
          right: 'unset !important',
          content: '"[아카콘 뮤트됨]" !important',
          fontSize: 'inherit !important',
          background: 'unset !important',
          color: 'inherit !important',
          fontWeight: 'inherit !important',
          padding: 'unset !important',
        },
      },
    },
  },
};

function ArticleMuter() {
  const { emoticon } = useSelector((state) => state[MODULE_ID]);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);
  const [article, setArticle] = useState(null);
  const emoticonFilter = useEmoticon(emoticon);

  useEffect(() => {
    if (articleLoaded) setArticle(document.querySelector(ARTICLE_VIEW));
  }, [articleLoaded]);

  useEffect(() => {
    if (!article) return;

    const muteArticle = () => {
      const articleImage = [...document.querySelectorAll(ARTICLE_IMAGES)];
      articleImage.forEach((i) => {
        const { clientWidth: width, clientHeight: height, src } = i;

        // Normal Image
        if (width > 100 || height > 100) return;

        const filterFormat = src
          .replace('https:', '')
          .replace('-p', '')
          .replace('.mp4', '.mp4.gif');

        // eslint-disable-next-line no-unused-expressions
        i.closest('a')?.classList.toggle(
          'filtered-emoticon',
          emoticonFilter.url.indexOf(filterFormat) > -1,
        );
      });
    };

    window.addEventListener('load', muteArticle);
  }, [article, emoticonFilter]);

  return null;
}

export default withStyles(style)(ArticleMuter);
