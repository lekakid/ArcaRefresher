import React, { useEffect, useState } from 'react';
import { Portal } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { AuthorTag } from 'component';
import { FULL_LOADED, USER_INFO } from 'core/selector';
import { useLoadChecker } from 'util/LoadChecker';
import { getUserIP, getUserKey } from 'func/user';

import DB from './ip';
import Info from './FeatureInfo';

const useStyles = makeStyles(
  {
    red: {
      backgroundColor: '#ec4545',
      color: 'white',
    },
    green: {
      backgroundColor: '#258d25',
      color: 'white',
    },
    blue: {
      backgroundColor: '#0a96f2',
      color: 'white',
    },
  },
  { name: Info.ID },
);

export default function IPInfo() {
  const [infoList, setInfoList] = useState([]);
  const loaded = useLoadChecker(FULL_LOADED);
  const classes = useStyles();

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
            e.querySelector('.ip-info') || document.createElement('span');
          if (!container.parentNode) {
            container.classList.add('ip-info');
            e.append(container);
          }

          return { key, label, color, container };
        })
        .filter((e) => e);

      setInfoList(list);
    };
    if (loaded) refreshUserInfo();
    addAREvent(EVENT_AUTOREFRESH, refreshUserInfo);
    addAREvent(EVENT_COMMENT_REFRESH, refreshUserInfo);
  }, [loaded]);

  return (
    <>
      {infoList.map(({ key, label, color, container }) => (
        <Portal key={key} container={container}>
          <AuthorTag className={classes[color]}>{label}</AuthorTag>
        </Portal>
      ))}
    </>
  );
}
