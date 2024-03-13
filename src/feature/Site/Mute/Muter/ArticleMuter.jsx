import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { ARTICLE_EMOTICON, ARTICLE_LOADED, ARTICLE } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { trimEmotURL } from '../func';
import { filterSelector } from '../selector';
import Info from '../FeatureInfo';

const articleMuteStyles = (
  <GlobalStyles
    styles={{
      '.article-content': {
        '& .muted': {
          '& img, & video': {
            display: 'none',
          },
          '&::after': {
            position: 'inherit',
            bottom: 'unset',
            right: 'unset',
            content: '"[아카콘 뮤트됨]"',
            fontSize: 'inherit',
            background: 'unset',
            color: 'inherit',
            fontWeight: 'inherit',
            padding: 'unset',
          },
        },
      },
    }}
  />
);

function ArticleMuter() {
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  const filter = useSelector(filterSelector);
  const { hideMutedMark, muteAllEmot } = useSelector(
    (state) => state[Info.id].storage,
  );
  const [controlTarget, setControlTarget] = useState(null);

  useEffect(() => {
    if (articleLoaded) setControlTarget(document.querySelector(ARTICLE));
  }, [articleLoaded]);

  // 이모티콘 뮤트
  useEffect(() => {
    if (!controlTarget) return undefined;

    const muteArticle = () => {
      const articleImage = [...document.querySelectorAll(ARTICLE_EMOTICON)];
      articleImage.forEach((i) => {
        const { src } = i;

        const filterFormat = trimEmotURL(src);
        const wrapper = i.closest('a');
        if (wrapper && (muteAllEmot || !!filter.emoticon.url[filterFormat])) {
          wrapper.classList.add('muted');
          wrapper.dataset.href = wrapper.href;
          wrapper.removeAttribute('href');
          wrapper.title = muteAllEmot
            ? '알 수 없음'
            : filter.emoticon.url[filterFormat];
        }
      });
    };

    const unmuteArticle = () => {
      const articleImage = [...document.querySelectorAll(ARTICLE_EMOTICON)];
      articleImage.forEach((i) => {
        const { src } = i;

        const filterFormat = trimEmotURL(src);
        const wrapper = i.closest('a');
        if (wrapper && !!filter.emoticon.url[filterFormat]) {
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
  }, [controlTarget, filter.emoticon, hideMutedMark, muteAllEmot]);

  return articleMuteStyles;
}

export default ArticleMuter;
