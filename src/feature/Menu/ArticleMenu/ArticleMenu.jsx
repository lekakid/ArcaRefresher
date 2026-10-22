import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Portal, Typography } from '@mui/material';

import { ARTICLE_HEAD, ARTICLE_TITLE } from 'constants/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import info from './info';

const articleMenuModules = import.meta.glob(
  ['/src/feature/*/*/ArticleMenu.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const articleMenuChildren = Object.entries(articleMenuModules).map(
  ([path, Component]) => <Component key={path} />,
);

function ArticleMenu() {
  const articleLoaded = useLoadChecker(ARTICLE_TITLE);
  const { position } = useSelector((state) => state[info.id].storage);

  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    if (!articleLoaded) return;

    const articleHead = document.querySelector(ARTICLE_HEAD);
    if (!articleHead) return;

    switch (position) {
      case 'beforeHead':
        articleHead.insertAdjacentElement('beforebegin', container);
        break;
      case 'afterHead':
        articleHead.insertAdjacentElement('afterend', container);
        break;
      default:
        container.remove();
        break;
    }
  }, [position, articleLoaded, container]);

  if (!container) return null;
  return (
    <Portal container={container}>
      <Grid
        container
        sx={{
          alignItems: 'center',
          borderTop:
            position === 'beforeHead'
              ? '1px solid var(--color-bd-outer)'
              : undefined,
          borderBottom:
            position === 'afterHead'
              ? '1px solid var(--color-bd-outer)'
              : undefined,
        }}
      >
        <Grid
          size={{ xs: 12, sm: 3 }}
          sx={{
            paddingLeft: 1,
          }}
        >
          <Typography variant="subtitle1">리프레셔 메뉴</Typography>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 9 }}
          sx={{ paddingRight: 1, textAlign: 'end' }}
        >
          {articleMenuChildren}
        </Grid>
      </Grid>
    </Portal>
  );
}

export default ArticleMenu;
