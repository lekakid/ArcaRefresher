import { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { NAVIGATION_LOADED, NAVIGATION_MENU } from 'constants/selector';
import { useLoadChecker } from 'core/LoadChecker';

import { setOpen } from '../slice';

// 렌더 컨테이너
const navEl = document.createElement('li');
navEl.classList.add('nav-item', 'dropdown');

export default function HeaderButton() {
  const dispatch = useDispatch();
  const navigationLoaded = useLoadChecker(NAVIGATION_LOADED);

  // 상단바 렌더 체크
  useLayoutEffect(() => {
    if (!navigationLoaded) return;

    const nav = document.querySelector(NAVIGATION_MENU);
    if (!nav) return;
    const searchbarEl = nav.querySelector('.nav-channel-search-wrapper');
    nav.insertBefore(navEl, searchbarEl);
  }, [navigationLoaded]);

  // 상단바가 없는 경우 ! 입력 시 설정 화면 표시
  useLayoutEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== '!') return;
      if (
        !document.querySelector('.root-container.single') &&
        navEl.parentElement
      )
        return;
      if (e.target.matches('input, textarea, [contenteditable]')) return;

      dispatch(setOpen(true));
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dispatch]);

  return ReactDOM.createPortal(
    <a
      aria-expanded="false"
      className="nav-link"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        dispatch(setOpen(true));
      }}
    >
      <span className="d-inline">리프레셔</span>
      <span className="d-none d-sm-inline ml-2 ion-gear-a" />
    </a>,
    navEl,
  );
}
