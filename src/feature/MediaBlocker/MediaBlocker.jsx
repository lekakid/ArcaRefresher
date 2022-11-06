import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useElementQuery } from 'core/hooks';
import { ARTICLE_MEDIA, DELETED_ALERT_LOADED } from 'core/selector';
import { useContent } from 'util/ContentInfo';

import Blocker from './Blocker';
import Info from './FeatureInfo';

function generateInfo(element, container) {
  return { element, container };
}

export default function MediaBlocker() {
  const {
    storage: { enabled, deletedOnly },
  } = useSelector((state) => state[Info.ID]);
  const {
    load: { article: articleLoaded },
  } = useContent();
  const alertLoaded = useElementQuery(DELETED_ALERT_LOADED);
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
