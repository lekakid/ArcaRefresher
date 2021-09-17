import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  ARTICLE_LOADED,
  BOARD_LOADED,
  COMMENT_SUBTITLE,
  COMMENT_TITLE,
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
          const boardURL = window.location.pathname.replace(/\/[0-9]+/, '');
          window.location.pathname = boardURL;
          break;
        }
        case 'E':
          e.preventDefault();
          document.querySelector('#rateUp').click();
          break;
        case 'R': {
          escape.preventDefault();
          const commentForm = document.querySelector(COMMENT_TITLE);
          window.scrollTo({
            top: commentForm.offsetTop - 50,
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
          const top =
            window.pageYOffset + inputForm.getBoundingClientRect().top;
          window.scrollTo({ top: top - 50, behavior: 'smooth' });
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
          const path = window.location.pathname.split('/');
          let writePath = '';
          if (path[path.length - 1] === '') {
            path[path.length - 1] = 'write';
          } else {
            path.push('write');
          }
          writePath = path.join('/');
          window.location.pathname = writePath;
          break;
        }
        case 'E': {
          e.preventDefault();
          if (window.location.search.indexOf('mode=best') > -1) {
            window.location.search = '';
          } else {
            window.location.search = '?mode=best';
          }
          break;
        }
        case 'D': {
          e.preventDefault();
          const active = document.querySelector('.pagination .active');
          if (active.previousElementSibling) {
            active.previousElementSibling.firstElementChild.click();
          }
          break;
        }
        case 'F': {
          e.preventDefault();
          const active = document.querySelector('.pagination .active');
          if (active.nextElementSibling) {
            active.nextElementSibling.firstElementChild.click();
          }
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
