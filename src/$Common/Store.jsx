import { configureStore } from '@reduxjs/toolkit';
import ContextMenu from '../$ContextMenu/slice';
import AutoRefresher from '../AutoRefresher/slice';
import ArticleRemover from '../ArticleRemover/slice';
import ImageDownloader from '../ImageDownloader/slice';

export default configureStore({
  reducer: {
    ContextMenu,
    AutoRefresher,
    ArticleRemover,
    ImageDownloader,
  },
});
