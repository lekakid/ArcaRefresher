import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import store from 'core/store';
import { light, dark } from 'core/theme';

import Menu from 'menu';
import Feature from 'feature';
import ContentInfo from 'util/ContentInfo';

export default function App() {
  const browserDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('theme-dark'));
    });
    observer.observe(document.documentElement, { attributes: true });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={browserDarkMode || darkMode ? dark : light}>
        <ContentInfo />
        <Feature />
        <Menu />
      </ThemeProvider>
    </Provider>
  );
}
