import React, { useEffect, useState } from 'react';
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

function Info({ ip }) {
  const [ipType, setIPType] = useState(null);

  useEffect(() => {
    if (!ip) return;

    const isExist = Object.keys(DB).some((type) => {
      if (DB[type].list.indexOf(ip) > -1) {
        const { label, color } = DB[type];
        setIPType({ label, color });
        return true;
      }
      return false;
    });
    if (!isExist) setIPType({ label: '고정', color: 'green' });
  }, [ip]);

  const classes = useStyles();
  if (!ipType) return null;

  return <span className={classes[ipType.color]}>{`-${ipType.label}`}</span>;
}

export default React.memo(Info);
