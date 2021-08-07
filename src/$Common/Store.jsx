import { configureStore } from '@reduxjs/toolkit';
import ContextMenu from '../$ContextMenu/slice';
import ArticleHeader from '../$ArticleHeader/slice';
import AutoRefresher from '../AutoRefresher/slice';
import ArticleRemover from '../ArticleRemover/slice';
import ImageDownloader from '../ImageDownloader/slice';
import AnonymousNick from '../AnonymousNick/slice';

export default configureStore({
  reducer: {
    ContextMenu,
    ArticleHeader,
    AutoRefresher,
    ArticleRemover,
    ImageDownloader,
    AnonymousNick,
  },
});
