import React from 'react';
import ReactDOM from 'react-dom';

function AnonymousNick({ show, nick, container }) {
  if (!show) return null;

  return ReactDOM.createPortal(<span>{nick}</span>, container);
}

export default React.memo(AnonymousNick);
