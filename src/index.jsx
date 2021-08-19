import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';

import Store from './$Common/Store';
import theme from './$Common/Theme';
import Config from './$Config';
import ContextMenu from './$ContextMenu';
import ArticleHeaderMenu from './$ArticleHeader';
import AutoRefresher from './AutoRefresher';
import CommentRefresh from './CommentRefresh';
import ArticleRemover from './ArticleRemover';
import ImageDownloader from './ImageDownloader';
import ImageSearch from './ImageSearch';
import IPInfo from './IPInfo';
import AnonymousNick from './AnonymousNick';
import Memo from './Memo';
import LayoutCustom from './LayoutCustom';
import ExperienceCustom from './ExperienceCustom';
import TemporarySave from './TemporarySave';
import Mute from './Mute';
import MyImage from './MyImage';

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
      <ThemeProvider theme={theme}>
        <Config />
        <ContextMenu />
        <ArticleHeaderMenu />
        <AutoRefresher />
        <CommentRefresh />
        <ArticleRemover />
        <ImageDownloader />
        <ImageSearch />
        <IPInfo />
        <AnonymousNick />
        <Memo />
        <LayoutCustom />
        <ExperienceCustom />
        <TemporarySave />
        <Mute />
        <MyImage />
      </ThemeProvider>
    </Provider>,
    appContainer,
  );
})();
