import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalStyles, Grid2 as Grid, Portal, Typography } from '@mui/material';

import { ARTICLE_HEADER_MENU } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

function EditMenuStyles() {
  return (
    <GlobalStyles
      styles={{
        '.edit-menu': {
          borderBottom: '1px solid var(--color-bd-outer)',
          '&:empty': {
            display: 'none',
          },
        },
      }}
    />
  );
}

function ArticleMenu({ children }) {
  const [container, setContainer] = useState(null);
  const articleLoaded = useLoadChecker(ARTICLE_HEADER_MENU);

  useEffect(() => {
    if (!articleLoaded) return;

    const editMenu = document.querySelector(ARTICLE_HEADER_MENU);
    if (!editMenu) return;

    const menuContainer = document.createElement('div');
    editMenu.innerHTML = editMenu.innerHTML.trim();
    editMenu.insertAdjacentElement('afterend', menuContainer);
    setContainer(menuContainer);
  }, [articleLoaded]);

  if (!container) return null;
  return (
    <>
      <EditMenuStyles />
      <Portal container={container}>
        <Grid container alignItems="center">
          <Grid size={{ xs: 12, sm: 3 }} sx={{ paddingLeft: 1 }}>
            <Typography variant="subtitle1">리프레셔 메뉴</Typography>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 9 }}
            sx={{ paddingRight: 1, textAlign: 'end' }}
          >
            {children}
          </Grid>
        </Grid>
      </Portal>
    </>
  );
}

ArticleMenu.propTypes = {
  children: PropTypes.node,
};

export default ArticleMenu;
