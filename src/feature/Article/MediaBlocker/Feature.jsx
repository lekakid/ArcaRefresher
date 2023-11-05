import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ARTICLE_LOADED,
  ARTICLE_MEDIA,
  DELETED_ALERT_LOADED,
} from 'core/selector';
import { useLoadChecker } from 'hooks';

import Blocker from './Blocker';
import Info from './FeatureInfo';

function generateInfo(element, container) {
  return { element, container };
}

export default function MediaBlocker() {
  const {
    storage: { enabled, deletedOnly },
  } = useSelector((state) => state[Info.ID]);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const alertLoaded = useLoadChecker(DELETED_ALERT_LOADED);
  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    if (!enabled || (deletedOnly && !alertLoaded)) {
      setInfoList([]);
      return;
    }
    if (!articleLoaded) return;

    const images = [...document.querySelectorAll(ARTICLE_MEDIA)];
    const info = images.map((e) => {
      const container = document.createElement('div');
      e.insertAdjacentElement('afterend', container);

      return generateInfo(e, container);
    });
    setInfoList(info);
  }, [alertLoaded, articleLoaded, deletedOnly, enabled]);

  if (infoList.length === 0) return null;

  return (
    <>
      {infoList.map(({ element, container }) => (
        <Blocker
          key={element.src}
          referenceElement={element}
          container={container}
        />
      ))}
    </>
  );
}
