import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { ARTICLE_GIFS, ARTICLE_IMAGES, ARTICLE_VIEW } from 'core/selector';
import { useContent } from 'util/ContentInfo';

import Info from '../FeatureInfo';
import { emoticonFilterSelector } from '../selector';

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
      '& .hide-filtered-emoticon': {
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
  const {
    load: { article: articleLoaded },
  } = useContent();
  const [article, setArticle] = useState(null);
  const emoticonFilter = useSelector(emoticonFilterSelector);

  useEffect(() => {
    if (articleLoaded) setArticle(document.querySelector(ARTICLE_VIEW));
  }, [articleLoaded]);

  useEffect(() => {
    if (!article) return;

    const muteArticle = () => {
      const articleImage = [
        ...document.querySelectorAll(`${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`),
      ];
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
          hideMutedMark ? 'hide-filtered-emoticon' : 'filtered-emoticon',
          emoticonFilter.url.indexOf(filterFormat) > -1,
        );
      });
    };

    window.addEventListener('load', muteArticle);
  }, [article, emoticonFilter, hideMutedMark]);

  return null;
}

export default withStyles(style)(ArticleMuter);
