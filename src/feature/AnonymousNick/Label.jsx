import React from 'react';
import ReactDOM from 'react-dom';

function AnonymousNick({ nick, container }) {
  return ReactDOM.createPortal(<span>{nick}</span>, container);
}

export default React.memo(AnonymousNick);
