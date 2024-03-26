import { memo } from 'react';
import ReactDOM from 'react-dom';

function AnonymousNick({ container, children }) {
  return ReactDOM.createPortal(<span>{children}</span>, container);
}

export default memo(AnonymousNick);
