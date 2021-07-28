import { configureStore } from '@reduxjs/toolkit';
import AutoRefresher from '../AutoRefresher/slice';

export default configureStore({
  reducer: {
    AutoRefresher,
  },
});
