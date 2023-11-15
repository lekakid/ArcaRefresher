import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { ARTICLE_EMOTICON, ARTICLE_LOADED, ARTICLE } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { trimEmotURL } from '../func';
import { filterSelector } from '../selector';
import Info from '../FeatureInfo';

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
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  const { emotList } = useSelector(filterSelector);
  const { hideMutedMark } = useSelector((state) => state[Info.ID].storage);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (articleLoaded) setArticle(document.querySelector(ARTICLE));
  }, [articleLoaded]);

  // 이모티콘 뮤트
  useEffect(() => {
    if (!article) return undefined;

    const muteArticle = () => {
      const articleImage = [...document.querySelectorAll(ARTICLE_EMOTICON)];
      articleImage.forEach((i) => {
        const { src } = i;

        const filterFormat = trimEmotURL(src);
        const wrapper = i.closest('a');
        if (wrapper && !!emotList.url[filterFormat]) {
          wrapper.classList.add('muted');
          wrapper.dataset.href = wrapper.href;
          wrapper.removeAttribute('href');
          wrapper.title = emotList.url[filterFormat];
        }
      });
    };

    const unmuteArticle = () => {
      const articleImage = [...document.querySelectorAll(ARTICLE_EMOTICON)];
      articleImage.forEach((i) => {
        const { src } = i;

        const filterFormat = trimEmotURL(src);
        const wrapper = i.closest('a');
        if (wrapper && !!emotList.url[filterFormat]) {
          wrapper.classList.remove('muted');
          wrapper.href = wrapper.dataset.href;
          delete wrapper.dataset.href;
          wrapper.removeAttribute('title');
        }
      });
    };

    if (document.readyState !== 'complete') {
      window.addEventListener('load', muteArticle);
      return () => {
        window.removeEventListener('load', muteArticle);
        unmuteArticle();
      };
    }

    muteArticle();
    return () => unmuteArticle();
  }, [article, emotList, hideMutedMark]);

  return null;
}

export default withStyles(style)(ArticleMuter);
