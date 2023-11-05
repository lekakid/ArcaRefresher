import React from 'react';
import ReactDOM from 'react-dom';

function AnonymousNick({ container, children }) {
  return ReactDOM.createPortal(<span>{children}</span>, container);
}

export default React.memo(AnonymousNick);
