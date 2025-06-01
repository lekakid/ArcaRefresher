import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { NAVIGATION_LOADED, NAVIGATION_MENU } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { setOpen } from './slice';

export default function HeaderButton() {
  const dispatch = useDispatch();
  const [navEl, setNavEl] = useState(null);
  const navigationLoaded = useLoadChecker(NAVIGATION_LOADED);

  useEffect(() => {
    if (navigationLoaded) {
      const container = document.createElement('div');
      const nav = document.querySelector(NAVIGATION_MENU);
      const searchbarEl = nav.querySelector('.nav-channel-search-wrapper');
      nav.insertBefore(container, searchbarEl);
      setNavEl(container);
      return undefined;
    }

    const onKeyDown = (e) => {
      if (e.key === '!') {
        if (e.target.matches('input, textarea, [contenteditable]')) return;
        dispatch(setOpen(true));
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dispatch, navigationLoaded]);

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(setOpen(true));
    },
    [dispatch],
  );

  if (!navEl) return null;

  return ReactDOM.createPortal(
    <li className="nav-item dropdown">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a aria-expanded="false" className="nav-link" href="#" onClick={onClick}>
        <span className="d-none d-md-inline">리프레셔 설정 </span>
        <span className="d-inline d-md-none">리프레셔 </span>
        <span className="d-none d-sm-inline ion-gear-a" />
      </a>
    </li>,
    navEl,
  );
}
