import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

import useAwaitElement from '../$Common/AwaitElement';
import { NAVIGATION_LOADED, NAVIGATION_MENU } from '../$Common/Selector';

export default function HeaderButton(props) {
  const [isOpeningModal, setOpenModal] = useState(false);
  const [container, setContainer] = useState(null);
  const { dialog: Dialog } = props;

  useAwaitElement(NAVIGATION_LOADED, () => {
    const currentContainer = document.createElement('div');
    document.querySelector(NAVIGATION_MENU).appendChild(currentContainer);
    setContainer(currentContainer);
  });

  const onClick = useCallback((e) => {
    e.preventDefault();
    setOpenModal(() => true);
  }, []);

  const onClose = useCallback(() => {
    setOpenModal(() => false);
  }, []);

  if (!container) return null;

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
    container,
  );
}
