import { configureStore } from '@reduxjs/toolkit';
import AutoRefresher from '../AutoRefresher/slice';
import ArticleRemover from '../ArticleRemover/slice';

export default configureStore({
  reducer: {
    AutoRefresher,
    ArticleRemover,
  },
});
