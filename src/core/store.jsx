import { configureStore } from '@reduxjs/toolkit';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';

import { setValue } from 'core/storage';

const menuContext = require.context('menu/', true, /^menu\/(?!_).+\/slice$/);

const featureContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/slice$/,
);

const utilContext = require.context('util/', true, /^util\/(?!_).+\/slice$/);

const menuReducerEntries = menuContext
  .keys()
  .map((path) => [path.split('/')[1], menuContext(path).default]);

const featureReducerEntries = featureContext
  .keys()
  .map((path) => [path.split('/')[1], featureContext(path).default]);

const utilReducerEntries = utilContext
  .keys()
  .map((path) => [path.split('/')[1], utilContext(path).default]);

const store = configureStore({
  reducer: Object.fromEntries([
    ...menuReducerEntries,
    ...featureReducerEntries,
    ...utilReducerEntries,
  ]),
  middleware: [
    createStateSyncMiddleware({
      predicate: (action) => action.type.indexOf('/$') > -1,
    }),
  ],
});

store.subscribe(() => {
  Object.entries(store.getState())
    .filter(([, value]) => !!value.storage)
    .map(([key, value]) => setValue(key, value.storage));
});

initMessageListener(store);

export default store;
