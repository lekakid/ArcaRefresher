import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';

import {
  ARTICLE_LOADED,
  BOARD_LOADED,
  COMMENT_SUBTITLE,
  COMMENT_VIEW,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';

import { MODULE_ID } from './ModuleInfo';

export default function ShortCut() {
  const dispatch = useDispatch();
  const articleLoaded = useElementQuery(ARTICLE_LOADED);
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const { enabled } = useSelector((state) => state[MODULE_ID]);

  useEffect(() => {
    if (!enabled) return null;
    if (!articleLoaded) return null;

    const onArticle = (e) => {
      const { target, key, shiftKey, ctrlKey } = e;
      if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA') return;
      if (!/^[A-Za-z]$/.test(key)) return;

      const combine = `${ctrlKey ? 'ctrl+' : ''}${
        shiftKey ? 'shift+' : ''
      }${key.toUpperCase()}`;

      switch (combine) {
        case 'A': {
          e.preventDefault();
          const channelID = window.location.pathname.split('/')[2];
          const prevSearch = queryString.parse(window.location.search);
          const search = queryString.stringify(
            {
              mode: prevSearch.mode || '',
              p: prevSearch.p || '',
            },
            {
              skipEmptyString: true,
            },
          );
          let path = ['', 'b', channelID].join('/');
          path += search ? `?${search}` : '';
          window.location.href = path;
          break;
        }
        case 'E':
          e.preventDefault();
          document.querySelector('#rateUp').click();
          break;
        case 'R': {
          e.preventDefault();
          const commentForm = document.querySelector(COMMENT_VIEW);
          window.scrollTo({
            top: commentForm.offsetTop - window.innerHeight * 0.3,
            behavior: 'smooth',
          });
          break;
        }
        case 'W': {
          e.preventDefault();
          const inputForm = document.querySelector(COMMENT_SUBTITLE);
          const input = document.querySelector(
            '.article-comment .input textarea',
          );
          if (!input) break;

          const top =
            window.pageYOffset + inputForm.getBoundingClientRect().top;
          window.scrollTo({
            top: top - window.innerHeight * 0.7,
            behavior: 'smooth',
          });
          input.focus({ preventScroll: true });
          break;
        }
        default:
          break;
      }
    };

    document.addEventListener('keydown', onArticle);

    return () => {
      document.removeEventListener('keydown', onArticle);
    };
  }, [dispatch, articleLoaded, enabled]);

  useEffect(() => {
    if (!enabled) return null;
    if (articleLoaded) return null;
    if (!boardLoaded) return null;

    const onBoard = (e) => {
      const { target, key, shiftKey, ctrlKey } = e;
      if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA') return;
      if (!/^[A-Za-z]$/.test(key)) return;

      const combine = `${ctrlKey ? 'ctrl+' : ''}${
        shiftKey ? 'shift+' : ''
      }${key.toUpperCase()}`;

      switch (combine) {
        case 'W': {
          e.preventDefault();
          const channelID = window.location.pathname.split('/')[2];
          const writePath = ['', 'b', channelID, 'write'];
          window.location.pathname = writePath.join('/');
          break;
        }
        case 'E': {
          e.preventDefault();
          const search = queryString.parse(window.location.search);
          search.mode = search.mode ? '' : 'best';
          window.location.search = queryString.stringify(search, {
            skipEmptyString: true,
          });
          break;
        }
        case 'D': {
          e.preventDefault();
          const search = queryString.parse(window.location.search, {
            parseNumbers: true,
          });
          if (!search.p || search.p < 2) break;
          search.p -= 1;
          window.location.search = queryString.stringify(search, {
            skipEmptyString: true,
          });
          break;
        }
        case 'F': {
          e.preventDefault();
          const search = queryString.parse(window.location.search, {
            parseNumbers: true,
          });
          search.p = search.p + 1 || 2;
          window.location.search = queryString.stringify(search, {
            skipEmptyString: true,
          });
          break;
        }
        default:
          break;
      }
    };

    document.addEventListener('keydown', onBoard);

    return () => {
      document.removeEventListener('keydown', onBoard);
    };
  }, [dispatch, boardLoaded, enabled, articleLoaded]);

  return null;
}
