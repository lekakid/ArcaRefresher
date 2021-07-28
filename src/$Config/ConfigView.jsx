import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Dialog } from '@material-ui/core';

import AutoRefresher from '../AutoRefresher/ConfigView';

export default function ConfigView(props) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const currentContainer = document.createElement('div');
    setContainer(currentContainer);
    document.body.appendChild(currentContainer);
  }, []);

  if (!container) return null;
  return ReactDOM.createPortal(
    <Dialog fullWidth maxWidth="xs" open={props.open} onClose={props.onClose}>
      {/* TEST CODE */}
      <AutoRefresher />
    </Dialog>,
    container,
  );
}
