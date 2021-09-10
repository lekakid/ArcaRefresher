import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';

import store from 'core/store';
import theme from 'core/theme';

import Menu from 'menu';
import Feature from 'feature';

async function awaitDocumentBody() {
  return new Promise((resolve) => {
    if (document.body) {
      resolve();
      return;
    }

    const obs = new MutationObserver(() => {
      if (document.body) {
        obs.disconnect();
        resolve();
      }
    });
    obs.observe(document, { childList: true, subtree: true });
  });
}

(async function App() {
  const appContainer = document.createElement('div');
  await awaitDocumentBody();
  document.body.append(appContainer);

  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Menu />
        <Feature />
      </ThemeProvider>
    </Provider>,
    appContainer,
  );
})();
