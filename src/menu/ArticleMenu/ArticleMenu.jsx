import React, { useEffect, useState } from 'react';
import { Grid, Portal, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { ARTICLE_HEADER_MENU, ARTICLE_LOADED } from 'core/selector';
import { useLoadChecker } from 'hooks';

const useStyles = makeStyles((theme) => ({
  '@global': {
    '.edit-menu': {
      borderBottom: '1px solid var(--color-bd-outer)',
      '&:empty': {
        display: 'none',
      },
    },
  },
  root: {
    '& .MuiButton-root': {
      color: 'var(--color-text-color)',
    },
  },
  label: {
    paddingLeft: theme.spacing(1),
  },
  buttons: {
    paddingRight: theme.spacing(1),
    textAlign: 'end',
  },
}));

export default function ArticleMenu({ children }) {
  const [container, setContainer] = useState(null);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  useEffect(() => {
    if (!articleLoaded) return;

    const editMenu = document.querySelector(ARTICLE_HEADER_MENU);
    if (!editMenu) return;

    const menuContainer = document.createElement('div');
    editMenu.innerHTML = editMenu.innerHTML.trim();
    editMenu.insertAdjacentElement('afterend', menuContainer);
    setContainer(menuContainer);
  }, [articleLoaded]);

  const classes = useStyles();

  if (!container) return null;
  return (
    <Portal container={container}>
      <Grid container alignItems="center" classes={{ root: classes.root }}>
        <Grid item xs={12} sm={3} classes={{ root: classes.label }}>
          <Typography variant="subtitle1">리프레셔 메뉴</Typography>
        </Grid>
        <Grid item xs={12} sm={9} classes={{ root: classes.buttons }}>
          {children}
        </Grid>
      </Grid>
    </Portal>
  );
}
