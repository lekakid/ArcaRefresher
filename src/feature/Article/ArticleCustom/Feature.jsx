import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles, IconButton, Portal, Tooltip } from '@mui/material';
import { ZoomIn } from '@mui/icons-material';

import {
  ARTICLE_GIFS,
  ARTICLE_IMAGES,
  ARTICLE_LOADED,
  ARTICLE,
  ARTICLE_VIDEOS,
} from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { useConfirm } from 'component';
import { EVENT_COMMENT_REFRESH } from 'core/event';
import Info from './FeatureInfo';

const PREVIEW_SELECTOR =
  '.article-content img:not(.twemoji), .article-content video';

/* eslint-disable react/prop-types */
function HideDefaultImageStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#defaultImage': {
          display: 'none',
        },
      }}
    />
  );
}

function ResizeImageStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.article-body': {
          '& img, & video:not([controls])': {
            '&:not([class$="emoticon"])': {
              maxWidth: `${value}% !important`,
            },
          },
        },
      }}
    />
  );
}

function ResizeVideoStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.article-body video[controls]': {
          maxWidth: `${value}% !important`,
        },
      }}
    />
  );
}

function HideUnvoteStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#rateDownForm': {
          display: 'none',
        },
      }}
    />
  );
}

/* eslint-enable react/prop-types */

export default function ArticleCustom() {
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const [confirm, ConfirmDialog] = useConfirm();

  const {
    // 모양
    hideDefaultImage,
    resizeImage,
    resizeVideo,
    hideUnvote,
    // 동작
    blockMediaNewWindow,
    unmuteVideo,
    ignoreSpoilerFilter,
    removeBlur,
    ignoreExternalLinkWarning,
    ratedownGuard,
  } = useSelector((state) => state[Info.id].storage);
  const [article, setArticle] = useState(null);
  const [fakePreview, setFakePreview] = useState(null);

  // 게시물 로드 확인 및 엘리먼트 저장
  useEffect(() => {
    if (articleLoaded) {
      setArticle(document.querySelector(ARTICLE));
    }
  }, [articleLoaded]);

  // 이미지, 영상 새 창에서 열기 방지
  useEffect(() => {
    if (!article || !blockMediaNewWindow) return;

    article
      .querySelectorAll(`${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`)
      .forEach((i) => {
        const a = document.createElement('a');
        i.insertAdjacentElement('beforebegin', a);
        a.append(i);
      });
  }, [article, blockMediaNewWindow]);

  // 영상 뮤트 해제
  useEffect(() => {
    if (!article || !unmuteVideo) return;

    const videoList = article.querySelectorAll(`${ARTICLE_VIDEOS}`);
    if (!videoList.length) return;

    videoList.forEach((video) => {
      video.autoplay = false;
      video.volume = 0.5;
      video.muted = false;
    });
  }, [article, unmuteVideo]);

  // 스포일러 경고 무시
  useEffect(() => {
    if (!ignoreSpoilerFilter) return;

    document
      .querySelector('.spoiler-alert-content')
      ?.style.setProperty('display', 'none');
    document
      .querySelector('.spoiler-filter.active')
      ?.classList.remove('active');
  }, [ignoreSpoilerFilter]);

  // 블러 제거
  useEffect(() => {
    if (!removeBlur) return;

    document.querySelectorAll('.blur').forEach((e) => {
      e.classList.remove('blur');
    });
  }, [removeBlur]);

  // 외부 링크 경고 무시
  useEffect(() => {
    if (!article || !ignoreExternalLinkWarning) return undefined;

    const releaseExternal = () => {
      article.querySelectorAll('a.external').forEach((e) => {
        e.href = e.href.replace(/^https:\/\/.*\/https:\/\//, 'https://');
        e.href = e.href.replace(/^https:\/\/.*\/http:\/\//, 'http://');
        e.classList.remove('external');
      });
    };

    releaseExternal();

    window.addEventListener(EVENT_COMMENT_REFRESH, releaseExternal);
    return () =>
      window.addEventListener(EVENT_COMMENT_REFRESH, releaseExternal);
  }, [article, ignoreExternalLinkWarning]);

  // 비추천 방지
  useEffect(() => {
    if (!article || !ratedownGuard) return undefined;

    const ratedownButton = article.querySelector('#rateDown');
    if (!ratedownButton) return undefined;

    const ratedownClick = async (e) => {
      e.preventDefault();
      const value = await confirm({
        title: '비추천 재확인',
        content: '정말 비추천하시겠습니까?',
      });
      if (!value) return;

      ratedownButton.removeEventListener('click', ratedownClick);
      ratedownButton.click();
    };

    ratedownButton.addEventListener('click', ratedownClick);
    return () => ratedownButton.removeEventListener('click', ratedownClick);
  }, [article, ratedownGuard, confirm]);

  // 미리보기 훼이크 걷어내기
  useEffect(() => {
    if (!article) return;

    const preview = article.querySelector(PREVIEW_SELECTOR);
    if (!preview) return;

    const computedStyle = window.getComputedStyle(preview);
    const display = computedStyle.getPropertyValue('display');
    if (display === 'none') return;

    const width = parseInt(computedStyle.getPropertyValue('width'), 10);
    const height = parseInt(computedStyle.getPropertyValue('height'), 10);

    if (width < 10 && height < 10) {
      const alterParent = document.createElement('span');
      preview.parentElement.insertAdjacentElement('afterbegin', alterParent);
      alterParent.append(preview);
      const container = document.createElement('span');
      preview.parentElement.insertAdjacentElement('afterbegin', container);
      setFakePreview({ container, preview });
    }
  }, [article]);

  const handleFakePreview = useCallback(() => {
    setFakePreview(({ preview, container }) => {
      preview.style = { width: '', height: '' };
      preview.parentElement.replaceWith(preview);
      container.remove();
    });
  }, []);

  return (
    <>
      <HideDefaultImageStyles value={hideDefaultImage} />
      <ResizeImageStyles value={resizeImage} />
      <ResizeVideoStyles value={resizeVideo} />
      <HideUnvoteStyles value={hideUnvote} />

      <ConfirmDialog />
      {fakePreview && (
        <Portal container={fakePreview.container}>
          <Tooltip placement="right" title="미리보기 확대">
            <IconButton onClick={handleFakePreview} size="large">
              <ZoomIn />
            </IconButton>
          </Tooltip>
        </Portal>
      )}
    </>
  );
}
