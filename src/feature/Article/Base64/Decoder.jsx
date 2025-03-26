import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Snackbar, Typography } from '@mui/material';

import {
  ARTICLE_CONTENT,
  ARTICLE_LOADED,
  COMMENT_ITEMS,
  COMMENT_LOADED,
} from 'core/selector';
import { EVENT_COMMENT_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';

import { FOREGROUND, open } from 'func/window';
import { decode } from './func/base64';
import Info from './FeatureInfo';

const Base64Regex = {
  normal: /^([A-Za-z0-9+/]{4})+([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/,
  candidateUrl:
    /(aHR0|YUhS)([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=?|[A-Za-z0-9+/]{2}(==)?)?/,
  includeBreakLine:
    /(aHR0|YUhS)[A-Za-z0-9+/]*((<\/[a-z]+>(<br>)?<[a-z]+( [a-z]+(="[^"]*"))*>|<br>|\n)[A-Za-z0-9+/]+)+={0,2}/,
  excludePaddingChar:
    /^([A-Za-z0-9+/]{4})+([A-Za-z0-9+/]{3}|[A-Za-z0-9+/]{2})?$/,
  url: /^(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
};

const LABEL = {
  fix: '패딩 부호(=)가 빠진것 같습니다. 복원 후 복호화하시겠습니까?',
  url: '링크 주소 같습니다. 여시겠습니까?',
  more: '추가로 복호화할 수 있습니다.',
  final: '복호화 되었습니다.',
};

function tryDecodeAll(html, max = 200) {
  let result = html;

  // 개행 처리
  const brRegex = new RegExp(Base64Regex.includeBreakLine);
  for (
    let count = 0, breaklined = brRegex.exec(result)?.[0];
    count <= max && breaklined;
    count += 1, breaklined = brRegex.exec(result)?.[0]
  ) {
    if (count === max) {
      console.warn(`[tryDecodeAll] 줄바꿈 정리 시도가 ${max}번을 넘었습니다.`);
      break;
    }

    const concatnated = breaklined
      .replaceAll('<br>', '')
      .replaceAll('\n', '')
      .replaceAll(/<\/[a-z]+><[a-z]+( [a-z]+(="[^"]*")?)*>/g, '');
    result = result.replace(breaklined, concatnated);
  }

  const candidateRegex = new RegExp(Base64Regex.candidateUrl);
  const urlRegex = new RegExp(Base64Regex.url);
  for (
    let count = 0, encoded = candidateRegex.exec(result)?.[0];
    count <= max && encoded;
    count += 1, encoded = candidateRegex.exec(result)?.[0]
  ) {
    if (count === max) {
      console.warn(`[tryDecodeAll] 복호화 시도가 ${max}번을 넘었습니다.`);
      break;
    }

    try {
      if (encoded.length % 4 !== 0) {
        const c = 4 - (encoded.length % 4);
        encoded = `${encoded}${'='.repeat(c)}`;
      }
      const decodedString = decode(encoded);
      const urlList = decodedString
        .split(/\shttp/)
        .map((i, index) => (index > 0 ? `http${i.trim()}` : i.trim()))
        .map((i) => {
          if (candidateRegex.test(i)) {
            return i;
          }
          if (urlRegex.test(i)) {
            return `<a href="${i}" class="base64" target="_blank" rel="noopener noreferrer">${i}</a>`;
          }

          return `<p class="base64">${i
            .replace(/</g, '&lt;')
            .replace(
              />/g,
              '&gt;',
            )} <span style="color: red; font-weight: 700;">(⚠️ URL 형식에 맞지 않음)</span></p>`;
        });

      result = result.replace(candidateRegex, urlList.join('<br>'));
    } catch (error) {
      console.warn(`[tryDecodeAll] 복호화 오류\n원문: ${encoded}`, error);
      break;
    }
  }

  return result;
}

function Decoder() {
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const { enabled, autoDecode, clipboardDecode } = useSelector(
    (state) => state[Info.id].storage,
  );
  const { temporaryDisabled } = useSelector((state) => state[Info.id]);
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
    article.innerHTML = tryDecodeAll(article.innerHTML);
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

    const comments = document.querySelectorAll(COMMENT_ITEMS);
    const handler = () => {
      comments.forEach((c) => {
        const target = c.querySelector('.message pre');
        if (!target) return;

        const content = target.innerHTML;
        target.dataset.orig = content;
        target.innerHTML = tryDecodeAll(content, 5);
      });
    };

    handler();
    window.addEventListener(EVENT_COMMENT_REFRESH, handler);

    return () => {
      comments.forEach((c) => {
        const target = c.querySelector('.message pre');
        if (!target) return;

        target.innerHTML = target.dataset.orig;
      });
      window.removeEventListener(EVENT_COMMENT_REFRESH, handler);
    };
  }, [enabled, autoDecode, commentLoaded, temporaryDisabled]);

  const handleDecode = useCallback((data) => {
    let decoded;
    try {
      decoded = decode(data);
    } catch (error) {
      console.info('[Base64] 복호화 실패', error);
      setDecodeResult((prev) => ({
        ...prev,
        text: decoded,
        type: 'final',
      }));
    }

    if (Base64Regex.url.test(decoded)) {
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
      type: Base64Regex.normal.test(decoded) ? 'more' : 'final',
    }));
  }, []);

  // 복사 했을 시 자동 대응 메뉴
  useEffect(() => {
    if (!enabled) return undefined;
    if (!clipboardDecode) return undefined;

    const handler = (e) => {
      if (e.target.matches('input, textarea, [contenteditable]')) return;

      // 복사한 스트링
      const data = window
        .getSelection()
        .toLocaleString()
        .replaceAll('\n', '')
        .trim();

      // 패딩 부호가 빠진건지 검사
      if (Base64Regex.excludePaddingChar.test(data)) {
        setDecodeResult((prev) => ({
          ...prev,
          text: data,
          type: 'fix',
        }));
      }

      // base64가 맞다면 복호화
      if (Base64Regex.normal.test(data)) {
        handleDecode(data);
      }
    };

    document.addEventListener('copy', handler);
    return () => document.removeEventListener('copy', handler);
  }, [clipboardDecode, enabled, handleDecode]);

  const handleOneMore = () => {
    handleDecode(decodeResult.text);
  };

  const handleFix = () => {
    const count = 4 - (decodeResult.text.length % 4);
    const fixed = `${decodeResult.text}${'='.repeat(count)}`;
    handleDecode(fixed);
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
        <Box sx={{ maxWidth: 300 }}>
          <Typography>
            {LABEL[decodeResult.type] || '알 수 없는 타입'}
          </Typography>
          <Typography
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >{`"${decodeResult.text}"`}</Typography>
        </Box>
      }
      action={
        <>
          {decodeResult.type === 'more' && (
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={handleOneMore}
            >
              <Typography>복호화</Typography>
            </Button>
          )}
          {decodeResult.type === 'fix' && (
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={handleFix}
            >
              <Typography>복원</Typography>
            </Button>
          )}
          {decodeResult.type === 'url' && (
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={handleUrlOpen}
            >
              <Typography>열기</Typography>
            </Button>
          )}
          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={handleCopy}
          >
            <Typography>복사</Typography>
          </Button>
        </>
      }
    />
  );
}

export default Decoder;
