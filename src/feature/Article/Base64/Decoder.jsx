import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Snackbar, Typography } from '@material-ui/core';

import {
  ARTICLE_CONTENT,
  ARTICLE_LOADED,
  COMMENT_INNER,
  COMMENT_LOADED,
} from 'core/selector';
import { EVENT_COMMENT_REFRESH, useEvent } from 'hooks/Event';
import { useLoadChecker } from 'hooks/LoadChecker';

import { FOREGROUND, open } from 'func/window';
import { decode } from './func/base64';
import Info from './FeatureInfo';

const URLBase64Regex =
  /(aHR0|YUhS)([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?/;
const URLBase64withBrRegex =
  /(aHR0|YUhS)([A-Za-z0-9+/]*(<br>|\n))+[A-Za-z0-9+/]*={0,2}/;
const base64Regex =
  /^([A-Za-z0-9+/]{4})+([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
const URLRegex =
  /^(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const LABEL = {
  url: '링크 주소 같습니다. 여시겠습니까?',
  normal: '복호화 되었습니다.',
};

function Decoder() {
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const commentLoaded = useLoadChecker(COMMENT_LOADED);
  const [addEventListener, removeEventListener] = useEvent();

  const { enabled, autoDecode, clipboardDecode } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const { temporaryDisabled } = useSelector((state) => state[Info.ID]);
  const [decodeResult, setDecodeResult] = useState();

  // 게시물 조회 디코딩 기능
  useEffect(() => {
    if (!enabled) return undefined;
    if (!autoDecode) return undefined;
    if (!articleLoaded) return undefined;
    if (temporaryDisabled) return undefined;

    const article = document.querySelector(ARTICLE_CONTENT);
    if (!article) return undefined;

    const originHTML = article.innerHTML;
    let html = article.innerHTML;
    let count = 0;

    // 개행 처리
    const brRegex = new RegExp(URLBase64withBrRegex);
    let breaklined = brRegex.exec(html)?.[0];
    while (breaklined) {
      const concatnated = breaklined
        .replaceAll('<br>', '')
        .replaceAll('\n', '');
      html = html.replace(breaklined, concatnated);

      breaklined = brRegex.exec(html)?.[0];

      count += 1;
      if (count > 20) {
        console.warn('[Base64] 줄바꿈 정리 시도가 20번을 넘었습니다.');
        break;
      }
    }

    count = 0;
    const regex = new RegExp(URLBase64Regex);
    let encoded = regex.exec(html)?.[0];
    while (encoded) {
      try {
        const result = decode(encoded);
        html = html.replace(
          regex,
          result.indexOf('http') > -1
            ? `<a href=${result} class="base64" target="_blank" rel="noopener noreferrer">${result}</a>`
            : result,
        );
      } catch (error) {
        console.warn(error);
      }

      count += 1;
      if (count > 20) {
        console.warn('[Base64] 디코드 시도가 20번을 넘었습니다.');
        break;
      }
      encoded = regex.exec(html)?.[0];
    }

    article.innerHTML = html;
    return () => {
      article.innerHTML = originHTML;
    };
  }, [articleLoaded, autoDecode, enabled, temporaryDisabled]);

  // 댓글 조회 디코딩 기능
  useEffect(() => {
    if (!enabled) return undefined;
    if (!autoDecode) return undefined;
    if (!commentLoaded) return undefined;
    if (temporaryDisabled) return undefined;

    let comment;
    let originHTML;

    const handler = () => {
      comment = document.querySelector(COMMENT_INNER);
      originHTML = comment.innerHTML;
      let html = comment.innerHTML;
      let count = 0;

      // 개행 처리
      const brRegex = new RegExp(URLBase64withBrRegex);
      let breaklined = brRegex.exec(html)?.[0];
      while (breaklined) {
        const concatnated = breaklined
          .replaceAll('<br>', '')
          .replaceAll('\n', '');
        html = html.replace(breaklined, concatnated);

        breaklined = brRegex.exec(html)?.[0];

        count += 1;
        if (count > 20) {
          console.warn('[Base64] 줄바꿈 정리 시도가 20번을 넘었습니다.');
          break;
        }
      }

      count = 0;
      const regex = new RegExp(URLBase64Regex);
      let encoded = regex.exec(html)?.[0];
      while (encoded) {
        const result = decode(encoded);
        html = html.replace(
          regex,
          result.indexOf('http') > -1
            ? `<a href=${result} class="base64" target="_blank" rel="noopener noreferrer">${result}</a>`
            : result,
        );

        encoded = regex.exec(html)?.[0];

        count += 1;
        if (count > 20) {
          console.warn('[Base64] 디코드 시도가 20번을 넘었습니다.');
          break;
        }
      }

      comment.innerHTML = html;
    };

    handler();
    addEventListener(EVENT_COMMENT_REFRESH, handler);
    return () => {
      comment.innerHTML = originHTML;
      removeEventListener(EVENT_COMMENT_REFRESH, handler);
    };
  }, [
    enabled,
    autoDecode,
    commentLoaded,
    temporaryDisabled,
    addEventListener,
    removeEventListener,
  ]);

  const handleDecode = useCallback((data) => {
    let decoded;
    try {
      decoded = decode(data);
    } catch (error) {
      console.info('[Base64] 복호화 실패', error);
      setDecodeResult((prev) => ({
        ...prev,
        text: decoded,
        more: false,
        type: 'normal',
      }));
    }

    if (URLRegex.test(decoded)) {
      setDecodeResult((prev) => ({
        ...prev,
        text: decoded,
        more: false,
        type: 'url',
      }));
      return;
    }

    setDecodeResult((prev) => ({
      ...prev,
      text: decoded,
      more: base64Regex.test(decoded),
      type: 'normal',
    }));
  }, []);

  // 복사 했을 시 자동 대응 메뉴
  useEffect(() => {
    if (!enabled) return undefined;
    if (!clipboardDecode) return undefined;

    const handler = (e) => {
      if (e.target.matches('input, textarea, [contenteditable]')) return;

      const data = window
        .getSelection()
        .toLocaleString()
        .replaceAll('\n', '')
        .trim();
      if (!base64Regex.test(data)) return;

      handleDecode(data);
    };

    document.addEventListener('copy', handler);
    return () => document.removeEventListener('copy', handler);
  }, [clipboardDecode, enabled, handleDecode]);

  const handleOneMore = () => {
    handleDecode(decodeResult.text);
  };

  const handleUrlOpen = () => {
    const url = new URL(decodeResult.text, 'https://a');
    open(url.href, FOREGROUND);
    setDecodeResult(undefined);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decodeResult.text);
    setDecodeResult(undefined);
  };

  if (!decodeResult) return null;
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={!!decodeResult}
      onClose={() => setDecodeResult(undefined)}
      autoHideDuration={3000}
      message={
        <Box maxWidth={300}>
          <Typography>{LABEL[decodeResult.type]}</Typography>
          <Typography
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >{`"${decodeResult.text}"`}</Typography>
        </Box>
      }
      action={
        <>
          {decodeResult.more && (
            <Button color="inherit" size="small" onClick={handleOneMore}>
              <Typography>복호화</Typography>
            </Button>
          )}
          {decodeResult.type === 'url' && (
            <Button color="inherit" size="small" onClick={handleUrlOpen}>
              <Typography>열기</Typography>
            </Button>
          )}
          <Button color="inherit" size="small" onClick={handleCopy}>
            <Typography>복사</Typography>
          </Button>
        </>
      }
    />
  );
}

export default Decoder;
