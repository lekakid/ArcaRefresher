import React, { useEffect, useRef, useState } from 'react';
import { Box, Portal } from '@mui/material';

import { AuthorTag } from 'component';
import { FULL_LOADED, USER_INFO } from 'core/selector';
import {
  EVENT_BOARD_REFRESH,
  EVENT_COMMENT_REFRESH,
  useEvent,
} from 'hooks/Event';
import { useLoadChecker } from 'hooks/LoadChecker';
import { getUserIP, getUserKey } from 'func/user';

import DB from './ip';

const styles = {
  '& .red': {
    backgroundColor: '#ec4545',
    color: 'white',
  },
  '& .green': {
    backgroundColor: '#258d25',
    color: 'white',
  },
  '& .blue': {
    backgroundColor: '#0a96f2',
    color: 'white',
  },
};

export default function IPInfo() {
  const [addEventListener] = useEvent();
  const loaded = useLoadChecker(FULL_LOADED);

  const infoContainer = useRef([]);
  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    const refreshUserInfo = () => {
      const list = [...document.querySelectorAll(USER_INFO)]
        .map((e, index) => {
          const key = getUserKey(e, index);
          const ip = getUserIP(e);
          if (!ip) return null;

          const { label, color } = Object.values(DB).find(({ list: ipList }) =>
            ipList.includes(ip),
          ) || { label: '고정', color: 'green' };

          const container =
            infoContainer.current[index] || document.createElement('span');
          if (!container.classList.contains('ip-info')) {
            container.classList.add('ip-info');
            infoContainer.current.push(container);
          }
          e.append(container);

          return { key, label, color, container };
        })
        .filter((e) => e);

      setInfoList(list);
    };
    if (loaded) refreshUserInfo();
    addEventListener(EVENT_BOARD_REFRESH, refreshUserInfo);
    addEventListener(EVENT_COMMENT_REFRESH, refreshUserInfo);
  }, [loaded, addEventListener]);

  return (
    <>
      {infoList.map(({ key, label, color, container }) => (
        <Portal key={key} container={container}>
          <Box sx={styles}>
            <AuthorTag className={color}>{label}</AuthorTag>
          </Box>
        </Portal>
      ))}
    </>
  );
}
