import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'react-uuid';
import { makeStyles } from '@material-ui/styles';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { AuthorLabel } from 'component';
import { USER_INFO } from 'core/selector';
import { getUserIP } from 'util/user';

import DB from './ip';
import { MODULE_ID } from './ModuleInfo';

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
  { name: MODULE_ID },
);

export default function IPInfo() {
  const [infoList, setInfoList] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const refreshUserInfo = () => {
      const list = [...document.querySelectorAll(USER_INFO)]
        .map((e) => {
          const key = e.dataset.key || uuid();
          // eslint-disable-next-line no-param-reassign
          if (!e.dataset.key) e.dataset.key = key;
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
    window.addEventListener('load', refreshUserInfo);
    addAREvent(EVENT_AUTOREFRESH, refreshUserInfo);
    addAREvent(EVENT_COMMENT_REFRESH, refreshUserInfo);
  }, []);

  return (
    <>
      {infoList.map(({ key, label, color, container }) =>
        ReactDOM.createPortal(
          <AuthorLabel key={key} className={classes[color]}>
            {label}
          </AuthorLabel>,
          container,
        ),
      )}
    </>
  );
}
