import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

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

(async () => {
  const appContainer = document.createElement('div');
  await awaitDocumentBody();
  document.body.append(appContainer);

  ReactDOM.render(<App />, appContainer);
})();
