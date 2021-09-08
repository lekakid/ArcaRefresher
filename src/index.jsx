import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';

import Store from 'core/store';
import theme from 'core/theme';

import Config from 'menu/Config';
import ContextMenu from 'menu/ContextMenu';
import ArticleMenu from 'menu/ArticleMenu';

import AutoRefresher from 'feature/AutoRefresher';
import CommentRefresh from 'feature/CommentRefresh';
import ArticleRemover from 'feature/ArticleRemover';
import ImageDownloader from 'feature/ImageDownloader';
import ImageSearch from 'feature/ImageSearch';
import IPInfo from 'feature/IPInfo';
import AnonymousNick from 'feature/AnonymousNick';
import Memo from 'feature/Memo';
import LayoutCustom from 'feature/LayoutCustom';
import ExperienceCustom from 'feature/ExperienceCustom';
import TemporarySave from 'feature/TemporarySave';
import Mute from 'feature/Mute';
import MyImage from 'feature/MyImage';
import CategoryStyler from 'feature/CategoryStyler';
import UserColor from 'feature/UserColor';
import ShortCut from 'feature/ShortCut';
import ThemeCustomizer from 'feature/ThemeCustomizer';

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
        <ArticleMenu />
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
        <CategoryStyler />
        <UserColor />
        <ShortCut />
        <ThemeCustomizer />
      </ThemeProvider>
    </Provider>,
    appContainer,
  );
})();
