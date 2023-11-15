import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Snackbar, Typography } from '@material-ui/core';

import { ARTICLE_CONTENT, ARTICLE_LOADED, COMMENT_LOADED } from 'core/selector';
import { EVENT_COMMENT_REFRESH, useEvent } from 'hooks/Event';
import { useLoadChecker } from 'hooks/LoadChecker';

import { FOREGROUND, open } from 'func/window';
import { decode } from './func/base64';
import Info from './FeatureInfo';

const URLBase64Regex =
  /(aHR0|YUhS)([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?/g;
const base64Regex =
  /^([A-Za-z0-9+/]{4})+([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
const URLRegex =
  /^(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

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
  const [decodeResult, setDecodeResult] = useState();

  // 게시물 조회 디코딩 기능
  useEffect(() => {
    if (!enabled) return;
    if (!autoDecode) return;
    if (!articleLoaded) return;

    const article = document.querySelector(ARTICLE_CONTENT);
    if (!article) return;

    let encoded = URLBase64Regex.exec(article.innerHTML)?.[0];
    let count = 0;

    while (encoded) {
      try {
        const result = decode(encoded);
        article.innerHTML = article.innerHTML.replace(
          URLBase64Regex,
          result.indexOf('http') > -1
            ? `<a href=${result} target="_blank" rel="noopener noreferrer">${result}</a>`
            : result,
        );
      } catch (error) {
        console.warn(error);
      }

      count += 1;
      // 안전 장치
      if (count > 20) {
        console.warn('[Base64] 디코드 시도가 20번을 넘었습니다.');
        break;
      }
      encoded = URLBase64Regex.exec(article.innerHTML)?.[0];
    }
  });

  // 댓글 조회 디코딩 기능
  useEffect(() => {
    if (!enabled) return undefined;
    if (!autoDecode) return undefined;
    if (!commentLoaded) return undefined;

    const handler = () => {
      let encoded = URLBase64Regex.exec(comment.innerHTML)?.[0];
      const comment = document.querySelector(COMMENT_INNER);

      while (encoded) {
        const result = decode(encoded);
        comment.innerHTML = comment.innerHTML.replace(
          URLBase64Regex,
          result.indexOf('http') > -1
            ? `<a href=${result} target="_blank" rel="noopener noreferrer">${result}</a>`
            : result,
        );

        encoded = URLBase64Regex.exec(comment.innerHTML)?.[0];
      }
    };

    handler();
    addEventListener(EVENT_COMMENT_REFRESH, handler);
    return () => removeEventListener(EVENT_COMMENT_REFRESH, handler);
  }, [
    enabled,
    autoDecode,
    commentLoaded,
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

      const data = window.getSelection().toLocaleString().trim();
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
    open(`https://${decodeResult.text}`, FOREGROUND);
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
      message={
        <>
          <Typography>{LABEL[decodeResult.type]}</Typography>
          <Typography>{`"${decodeResult.text}"`}</Typography>
        </>
      }
      autoHideDuration={3000}
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
