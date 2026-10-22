import { configureStore } from '@reduxjs/toolkit';
import { createMonkeySyncMiddleware } from 'store/storage';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(createMonkeySyncMiddleware()),
});

if (import.meta.hot) {
  import.meta.hot.accept('./rootReducer', (mod) => {
    store.replaceReducer(mod.default);
  });
}

export default store;
