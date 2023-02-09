import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { ARTICLE_EMOTICON, ARTICLE_LOADED, ARTICLE_VIEW } from 'core/selector';
import { useLoadChecker } from 'util/LoadChecker';

import Info from '../FeatureInfo';
import { emoticonFilterSelector } from '../selector';

const style = {
  '@global': {
    '.article-content': {
      '& .muted:not(.deleted)': {
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
      '& .deleted': {
        '& img, & video': {
          display: 'none !important',
        },
        '&::after': {
          content: 'none !important',
        },
      },
    },
  },
};

function ArticleMuter() {
  const {
    storage: { hideMutedMark },
  } = useSelector((state) => state[Info.ID]);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const [article, setArticle] = useState(null);
  const emoticonFilter = useSelector(emoticonFilterSelector);

  useEffect(() => {
    if (articleLoaded) setArticle(document.querySelector(ARTICLE_VIEW));
  }, [articleLoaded]);

  // 이모티콘 뮤트
  useEffect(() => {
    if (!article) return undefined;

    const muteArticle = () => {
      const articleImage = [...document.querySelectorAll(ARTICLE_EMOTICON)];
      articleImage.forEach((i) => {
        const { src } = i;

        const filterFormat = src
          .replace('https:', '')
          .replace('-p', '')
          .replace('.mp4', '.mp4.gif');

        i.closest('a')?.classList.toggle(
          'muted',
          emoticonFilter.url.indexOf(filterFormat) > -1,
        );
      });
    };

    if (document.readyState !== 'complete') {
      window.addEventListener('load', muteArticle);
      return () => window.removeEventListener('load', muteArticle);
    }

    muteArticle();
    return undefined;
  }, [article, emoticonFilter, hideMutedMark]);

  return null;
}

export default withStyles(style)(ArticleMuter);
