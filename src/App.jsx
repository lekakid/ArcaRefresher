import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import store from 'core/store';
import { light, dark } from 'core/theme';
import { useElementQuery } from 'core/hooks';

import Menu from 'menu';
import Feature from 'feature';
import Parser from 'util/Parser';

export default function App() {
  const browserDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkModeClass = useElementQuery('html.theme-dark', true, {
    attributes: true,
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={browserDarkMode || darkModeClass ? dark : light}>
        <Parser />
        <Menu />
        <Feature />
      </ThemeProvider>
    </Provider>
  );
}
