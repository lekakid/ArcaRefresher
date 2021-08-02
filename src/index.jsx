import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Store from './$Common/Store';
import Config from './$Config';
import AutoRefresher from './AutoRefresher';
import CommentRefresh from './CommentRefresh';
import ArticleRemover from './ArticleRemover';

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
    <Provider store={Store}>
      <Config />
      <AutoRefresher />
      <CommentRefresh />
      <ArticleRemover />
    </Provider>,
    appContainer,
  );
})();
