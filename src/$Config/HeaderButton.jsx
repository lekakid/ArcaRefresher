import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { NAVIGATION_LOADED, NAVIGATION_MENU } from '../$Common/Selector';
import useElementQuery from '../$Common/useElementQuery';

export default function HeaderButton(props) {
  const [isOpeningModal, setOpenModal] = useState(false);
  const [nav, setNav] = useState(null);
  const navigationLoaded = useElementQuery(NAVIGATION_LOADED);
  const { dialog: Dialog } = props;

  useEffect(() => {
    if (navigationLoaded) {
      const container = document.createElement('div');
      document.querySelector(NAVIGATION_MENU).appendChild(container);
      setNav(container);
    }
  }, [navigationLoaded]);

  const onClick = useCallback((e) => {
    e.preventDefault();
    setOpenModal(() => true);
  }, []);

  const onClose = useCallback(() => {
    setOpenModal(() => false);
  }, []);

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
      <Dialog open={isOpeningModal} onClose={onClose} />
    </li>,
    nav,
  );
}
