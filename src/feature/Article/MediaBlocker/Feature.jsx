import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ARTICLE_LOADED,
  ARTICLE_MEDIA,
  DELETED_ALERT_LOADED,
} from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import Blocker from './Blocker';
import Info from './FeatureInfo';

export default function MediaBlocker() {
  const { blockAll, blockDeleted } = useSelector(
    (state) => state[Info.id].storage,
  );
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const alertLoaded = useLoadChecker(DELETED_ALERT_LOADED);
  const [blockImgList, setBlockImgList] = useState([]);

  useEffect(() => {
    if (!articleLoaded) return;
    if (!(blockAll || (alertLoaded && blockDeleted))) {
      setBlockImgList([]);
      return;
    }

    const images = [...document.querySelectorAll(ARTICLE_MEDIA)];
    const info = images.map((e) => {
      const container = document.createElement('div');
      e.insertAdjacentElement('afterend', container);

      return { element: e, container };
    });
    setBlockImgList(info);
  }, [alertLoaded, articleLoaded, blockAll, blockDeleted]);

  if (blockImgList.length === 0) return null;

  return (
    <>
      {blockImgList.map(({ element, container }) => (
        <Blocker
          key={element.src}
          referenceElement={element}
          container={container}
        />
      ))}
    </>
  );
}
