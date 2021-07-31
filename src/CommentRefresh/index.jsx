import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import useAwaitElement from '../$Common/AwaitElement';
import {
  COMMENT_LOADED,
  COMMENT_SUBTITLE,
  COMMENT_TITLE,
} from '../$Common/Selector';
import RefreshButton from './RefreshButton';

export default function CommentRefresh() {
  const [container, setContainer] = useState(null);

  useAwaitElement(COMMENT_LOADED, () => {
    const titleContainer = document.createElement('span');
    const subtitleContainer = document.createElement('span');

    setContainer({
      title: document.querySelector(COMMENT_TITLE).appendChild(titleContainer),
      subtitle: document
        .querySelector(COMMENT_SUBTITLE)
        .appendChild(subtitleContainer),
    });
  });

  if (!container) return null;

  const { title, subtitle } = container;
  return (
    <>
      {ReactDOM.createPortal(<RefreshButton />, title)}
      {ReactDOM.createPortal(<RefreshButton />, subtitle)}
    </>
  );
}
