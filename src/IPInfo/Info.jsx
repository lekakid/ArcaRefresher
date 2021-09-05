import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core';

import DB from './DB';

const useStyles = makeStyles(() => ({
  red: {
    color: 'rgb(236, 69, 69)',
  },
  green: {
    color: 'rgb(37, 141, 37)',
  },
  blue: {
    color: 'rgb(56, 174, 252)',
  },
}));

function Info({ ip, container }) {
  const [ipType, setIPType] = useState(null);

  useLayoutEffect(() => {
    if (!ip) return;

    const isExist = Object.values(DB).some(({ list, label, color }) => {
      if (list.includes(ip)) {
        setIPType({ label, color });
        return true;
      }
      return false;
    });
    if (!isExist) setIPType({ label: '고정', color: 'green' });
  }, [ip]);

  const classes = useStyles();

  if (!ipType) return null;
  return ReactDOM.createPortal(
    <span className={classes[ipType.color]}>{`-${ipType.label}`}</span>,
    container,
  );
}

export default React.memo(Info);
