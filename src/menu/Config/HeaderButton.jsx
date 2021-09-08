import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { NAVIGATION_LOADED, NAVIGATION_MENU } from 'core/selector';
import { useElementQuery } from 'core/hooks';

import { setDialogOpen } from './slice';

export default function HeaderButton() {
  const dispatch = useDispatch();
  const [nav, setNav] = useState(null);
  const navigationLoaded = useElementQuery(NAVIGATION_LOADED);

  useEffect(() => {
    if (navigationLoaded) {
      const container = document.createElement('div');
      document.querySelector(NAVIGATION_MENU).appendChild(container);
      setNav(container);
    }
  }, [navigationLoaded]);

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(setDialogOpen(true));
    },
    [dispatch],
  );

  if (!nav) return null;

  return ReactDOM.createPortal(
    <li className="nav-item dropdown">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a aria-expanded="false" className="nav-link" href="#" onClick={onClick}>
        <span className="d-none d-sm-block">스크립트 설정</span>
        <span className="d-block d-sm-none">
          <span className="ion-gear-a" />
        </span>
      </a>
    </li>,
    nav,
  );
}
